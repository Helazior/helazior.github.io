package org.spongycastle.crypto.params;

import org.spongycastle.crypto.CipherParameters;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class RC2Parameters implements CipherParameters {
    private int bits;
    private byte[] key;

    public RC2Parameters(byte[] bArr) {
        this(bArr, bArr.length > 128 ? 1024 : bArr.length * 8);
    }

    public int getEffectiveKeyBits() {
        return this.bits;
    }

    public byte[] getKey() {
        return this.key;
    }

    public RC2Parameters(byte[] bArr, int i) {
        byte[] bArr2 = new byte[bArr.length];
        this.key = bArr2;
        this.bits = i;
        System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
    }
}
