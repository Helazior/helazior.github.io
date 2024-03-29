package org.spongycastle.crypto;

import org.spongycastle.util.Strings;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class PBEParametersGenerator {
    public int iterationCount;
    public byte[] password;
    public byte[] salt;

    public static byte[] PKCS12PasswordToBytes(char[] cArr) {
        if (cArr.length > 0) {
            byte[] bArr = new byte[(cArr.length + 1) * 2];
            for (int i = 0; i != cArr.length; i++) {
                int i2 = i * 2;
                bArr[i2] = (byte) (cArr[i] >>> '\b');
                bArr[i2 + 1] = (byte) cArr[i];
            }
            return bArr;
        }
        return new byte[0];
    }

    public static byte[] PKCS5PasswordToBytes(char[] cArr) {
        int length = cArr.length;
        byte[] bArr = new byte[length];
        for (int i = 0; i != length; i++) {
            bArr[i] = (byte) cArr[i];
        }
        return bArr;
    }

    public static byte[] PKCS5PasswordToUTF8Bytes(char[] cArr) {
        return Strings.toUTF8ByteArray(cArr);
    }

    public abstract CipherParameters generateDerivedMacParameters(int i);

    public abstract CipherParameters generateDerivedParameters(int i);

    public abstract CipherParameters generateDerivedParameters(int i, int i2);

    public int getIterationCount() {
        return this.iterationCount;
    }

    public byte[] getPassword() {
        return this.password;
    }

    public byte[] getSalt() {
        return this.salt;
    }

    public void init(byte[] bArr, byte[] bArr2, int i) {
        this.password = bArr;
        this.salt = bArr2;
        this.iterationCount = i;
    }
}
