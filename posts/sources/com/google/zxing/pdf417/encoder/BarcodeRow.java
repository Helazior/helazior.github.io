package com.google.zxing.pdf417.encoder;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class BarcodeRow {
    private int currentLocation = 0;
    private final byte[] row;

    public BarcodeRow(int i) {
        this.row = new byte[i];
    }

    public void addBar(boolean z, int i) {
        for (int i2 = 0; i2 < i; i2++) {
            int i3 = this.currentLocation;
            this.currentLocation = i3 + 1;
            set(i3, z);
        }
    }

    public byte[] getRow() {
        return this.row;
    }

    public byte[] getScaledRow(int i) {
        int length = this.row.length * i;
        byte[] bArr = new byte[length];
        for (int i2 = 0; i2 < length; i2++) {
            bArr[i2] = this.row[i2 / i];
        }
        return bArr;
    }

    public void set(int i, byte b) {
        this.row[i] = b;
    }

    public void set(int i, boolean z) {
        this.row[i] = z ? (byte) 1 : (byte) 0;
    }
}
