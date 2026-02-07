import forge from 'node-forge';

export interface DecryptionProgress {
  stage: 'reading' | 'deriving' | 'decrypting' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface DecryptionResult {
  success: boolean;
  data?: Uint8Array;
  filename?: string;
  error?: string;
}

/**
 * Decrypts a file using OpenSSL compatible AES-256-CBC with PBKDF2
 * 
 * OpenSSL file format:
 * - Bytes 0-7: "Salted__" magic string
 * - Bytes 8-15: 8-byte salt
 * - Bytes 16+: encrypted data
 * 
 * Key derivation:
 * - PBKDF2 with SHA-256
 * - 100,000 iterations (matching OpenSSL default with -pbkdf2)
 * - Derives 48 bytes: 32 bytes key + 16 bytes IV
 */
export async function decryptFile(
  file: File,
  password: string,
  onProgress?: (progress: DecryptionProgress) => void
): Promise<DecryptionResult> {
  try {
    // Validate password
    if (!password || password.length === 0) {
      return {
        success: false,
        error: '密码不能为空'
      };
    }

    // Read file
    onProgress?.({
      stage: 'reading',
      progress: 0,
      message: '正在读取文件...'
    });

    const fileData = await readFileAsArrayBuffer(file);
    const fileBytes = new Uint8Array(fileData);

    onProgress?.({
      stage: 'reading',
      progress: 100,
      message: '文件读取完成'
    });

    // Check minimum file size (16 bytes header)
    if (fileBytes.length < 16) {
      return {
        success: false,
        error: '文件太小，不是有效的加密文件'
      };
    }

    // Check magic string "Salted__"
    const magicString = new TextDecoder().decode(fileBytes.slice(0, 8));
    if (magicString !== 'Salted__') {
      return {
        success: false,
        error: '文件格式不正确，缺少Salted__标识。请确保文件是使用openssl enc命令加密的。'
      };
    }

    // Extract salt (bytes 8-15)
    const salt = fileBytes.slice(8, 16);

    // Extract encrypted data (bytes 16+)
    const encryptedData = fileBytes.slice(16);

    if (encryptedData.length === 0) {
      return {
        success: false,
        error: '加密数据为空'
      };
    }

    // Derive key and IV using PBKDF2
    onProgress?.({
      stage: 'deriving',
      progress: 0,
      message: '正在派生密钥...'
    });

    // Use PBKDF2 to derive key and IV
    // AES-256 needs 32 bytes key + 16 bytes IV = 48 bytes total
    const derivedKey = await deriveKey(password, salt, 100000);

    onProgress?.({
      stage: 'deriving',
      progress: 100,
      message: '密钥派生完成'
    });

    // Split derived key into key and IV
    const key = derivedKey.slice(0, 32);
    const iv = derivedKey.slice(32, 48);

    // Decrypt data
    onProgress?.({
      stage: 'decrypting',
      progress: 0,
      message: '正在解密数据...'
    });

    const decryptedData = await decryptAES256CBC(encryptedData, key, iv, (progress) => {
      onProgress?.({
        stage: 'decrypting',
        progress,
        message: '正在解密数据...'
      });
    });

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: '解密完成'
    });

    // Generate output filename
    const originalName = file.name;
    let outputName = originalName;

    // Remove .enc extension if present
    if (outputName.endsWith('.enc')) {
      outputName = outputName.slice(0, -4);
    }

    // If still has .tar.xz or similar, keep it
    // Otherwise add .decrypted extension
    if (outputName === originalName || outputName === originalName.replace('.enc', '')) {
      outputName = outputName + '.decrypted';
    }

    return {
      success: true,
      data: decryptedData,
      filename: outputName
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';

    onProgress?.({
      stage: 'error',
      progress: 0,
      message: `解密失败: ${errorMessage}`
    });

    return {
      success: false,
      error: `解密失败: ${errorMessage}`
    };
  }
}

/**
 * Read file as ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Derive key using PBKDF2
 * 
 * @param password - The password
 * @param salt - 8-byte salt
 * @param iterations - Number of iterations (default 100000 for OpenSSL compatibility)
 * @returns Derived key (48 bytes: 32 bytes key + 16 bytes IV)
 */
async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<Uint8Array> {
  // Use node-forge for PBKDF2
  const passwordBytes = forge.util.encodeUtf8(password);
  const saltBytes = forge.util.createBuffer(salt);

  // Derive 48 bytes: 32 for key + 16 for IV
  const derivedKeyBytes = forge.pkcs5.pbkdf2(
    passwordBytes,
    saltBytes.getBytes(),
    iterations,
    48,
    forge.md.sha256.create()
  );

  return new Uint8Array(forge.util.createBuffer(derivedKeyBytes).getBytes().split('').map((c: string) => c.charCodeAt(0)));
}

/**
 * Decrypt data using AES-256-CBC
 * 
 * @param encryptedData - The encrypted data
 * @param key - 32-byte key
 * @param iv - 16-byte IV
 * @param onProgress - Progress callback
 * @returns Decrypted data
 */
async function decryptAES256CBC(
  encryptedData: Uint8Array,
  key: Uint8Array,
  iv: Uint8Array,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  // Convert to forge buffers
  const keyBuffer = forge.util.createBuffer(key);
  const ivBuffer = forge.util.createBuffer(iv);

  // Create decipher
  const decipher = forge.cipher.createDecipher('AES-CBC', keyBuffer);
  decipher.start({ iv: ivBuffer });

  // Process in chunks for progress reporting
  const chunkSize = 64 * 1024; // 64KB chunks
  let offset = 0;


  while (offset < encryptedData.length) {
    const chunk = encryptedData.slice(offset, offset + chunkSize);
    const chunkBuffer = forge.util.createBuffer(chunk);
    decipher.update(chunkBuffer);

    offset += chunkSize;
    const progress = Math.min(100, Math.round((offset / encryptedData.length) * 100));
    onProgress?.(progress);

    // Allow UI to update
    if (offset < encryptedData.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  // Finish decryption
  const success = decipher.finish();

  if (!success) {
    throw new Error('解密失败，可能是密码错误或数据损坏');
  }

  // Get decrypted data
  const decryptedBytes = decipher.output.getBytes();
  return new Uint8Array(decryptedBytes.split('').map((c: string) => c.charCodeAt(0)));
}

/**
 * Download decrypted file
 */
export function downloadDecryptedFile(data: Uint8Array, filename: string): void {
  const blob = new Blob([data as unknown as BlobPart], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}
