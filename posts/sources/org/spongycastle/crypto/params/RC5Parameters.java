package org.spongycastle.crypto.params;

import org.spongycastle.crypto.CipherParameters;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class RC5Parameters implements CipherParameters {
    private byte[] key;
    private int rounds;

    public RC5Parameters(byte[] bArr, int i) {
        if (bArr.length <= 255) {
            byte[] bArr2 = new byte[bArr.length];
            this.key = bArr2;
            this.rounds = i;
            System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
            return;
        }
        throw new IllegalArgumentException("RC5 key length can be no greater than 255");
    }

    public byte[] getKey() {
        return this.key;
    }

    public int getRounds() {
        return this.rounds;
    }
}
