package org.spongycastle.crypto.util;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class Pack {
    public static int bigEndianToInt(byte[] bArr, int i) {
        int i2 = i + 1;
        int i3 = i2 + 1;
        return (bArr[i3 + 1] & 255) | (bArr[i] << 24) | ((bArr[i2] & 255) << 16) | ((bArr[i3] & 255) << 8);
    }

    public static long bigEndianToLong(byte[] bArr, int i) {
        int bigEndianToInt = bigEndianToInt(bArr, i);
        return (bigEndianToInt(bArr, i + 4) & 4294967295L) | ((bigEndianToInt & 4294967295L) << 32);
    }

    public static void intToBigEndian(int i, byte[] bArr, int i2) {
        bArr[i2] = (byte) (i >>> 24);
        int i3 = i2 + 1;
        bArr[i3] = (byte) (i >>> 16);
        int i4 = i3 + 1;
        bArr[i4] = (byte) (i >>> 8);
        bArr[i4 + 1] = (byte) i;
    }

    public static void intToLittleEndian(int i, byte[] bArr, int i2) {
        bArr[i2] = (byte) i;
        int i3 = i2 + 1;
        bArr[i3] = (byte) (i >>> 8);
        int i4 = i3 + 1;
        bArr[i4] = (byte) (i >>> 16);
        bArr[i4 + 1] = (byte) (i >>> 24);
    }

    public static int littleEndianToInt(byte[] bArr, int i) {
        int i2 = i + 1;
        int i3 = i2 + 1;
        return (bArr[i3 + 1] << 24) | (bArr[i] & 255) | ((bArr[i2] & 255) << 8) | ((bArr[i3] & 255) << 16);
    }

    public static long littleEndianToLong(byte[] bArr, int i) {
        return ((littleEndianToInt(bArr, i + 4) & 4294967295L) << 32) | (littleEndianToInt(bArr, i) & 4294967295L);
    }

    public static void longToBigEndian(long j, byte[] bArr, int i) {
        intToBigEndian((int) (j >>> 32), bArr, i);
        intToBigEndian((int) (j & 4294967295L), bArr, i + 4);
    }

    public static void longToLittleEndian(long j, byte[] bArr, int i) {
        intToLittleEndian((int) (4294967295L & j), bArr, i);
        intToLittleEndian((int) (j >>> 32), bArr, i + 4);
    }

    public static void bigEndianToInt(byte[] bArr, int i, int[] iArr) {
        for (int i2 = 0; i2 < iArr.length; i2++) {
            iArr[i2] = bigEndianToInt(bArr, i);
            i += 4;
        }
    }

    public static void intToBigEndian(int[] iArr, byte[] bArr, int i) {
        for (int i2 : iArr) {
            intToBigEndian(i2, bArr, i);
            i += 4;
        }
    }

    public static void intToLittleEndian(int[] iArr, byte[] bArr, int i) {
        for (int i2 : iArr) {
            intToLittleEndian(i2, bArr, i);
            i += 4;
        }
    }

    public static void littleEndianToInt(byte[] bArr, int i, int[] iArr) {
        for (int i2 = 0; i2 < iArr.length; i2++) {
            iArr[i2] = littleEndianToInt(bArr, i);
            i += 4;
        }
    }
}
