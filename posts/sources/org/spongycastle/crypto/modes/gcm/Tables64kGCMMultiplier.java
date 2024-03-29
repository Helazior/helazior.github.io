package org.spongycastle.crypto.modes.gcm;

import java.lang.reflect.Array;
import org.spongycastle.crypto.util.Pack;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class Tables64kGCMMultiplier implements GCMMultiplier {

    /* renamed from: M */
    private final int[][][] f5989M = (int[][][]) Array.newInstance(int[].class, 16, 256);

    @Override // org.spongycastle.crypto.modes.gcm.GCMMultiplier
    public void init(byte[] bArr) {
        int[][][] iArr = this.f5989M;
        iArr[0][0] = new int[4];
        iArr[0][128] = GCMUtil.asInts(bArr);
        for (int i = 64; i >= 1; i >>= 1) {
            int[] iArr2 = new int[4];
            System.arraycopy(this.f5989M[0][i + i], 0, iArr2, 0, 4);
            GCMUtil.multiplyP(iArr2);
            this.f5989M[0][i] = iArr2;
        }
        int i2 = 0;
        while (true) {
            for (int i3 = 2; i3 < 256; i3 += i3) {
                for (int i4 = 1; i4 < i3; i4++) {
                    int[] iArr3 = new int[4];
                    System.arraycopy(this.f5989M[i2][i3], 0, iArr3, 0, 4);
                    GCMUtil.xor(iArr3, this.f5989M[i2][i4]);
                    this.f5989M[i2][i3 + i4] = iArr3;
                }
            }
            i2++;
            if (i2 == 16) {
                return;
            }
            this.f5989M[i2][0] = new int[4];
            for (int i5 = 128; i5 > 0; i5 >>= 1) {
                int[] iArr4 = new int[4];
                System.arraycopy(this.f5989M[i2 - 1][i5], 0, iArr4, 0, 4);
                GCMUtil.multiplyP8(iArr4);
                this.f5989M[i2][i5] = iArr4;
            }
        }
    }

    @Override // org.spongycastle.crypto.modes.gcm.GCMMultiplier
    public void multiplyH(byte[] bArr) {
        int[] iArr = new int[4];
        for (int i = 15; i >= 0; i--) {
            int[] iArr2 = this.f5989M[i][bArr[i] & 255];
            iArr[0] = iArr[0] ^ iArr2[0];
            iArr[1] = iArr[1] ^ iArr2[1];
            iArr[2] = iArr[2] ^ iArr2[2];
            iArr[3] = iArr2[3] ^ iArr[3];
        }
        Pack.intToBigEndian(iArr, bArr, 0);
    }
}
