package org.spongycastle.crypto.tls;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ByteQueue {
    private static final int INITBUFSIZE = 1024;
    private byte[] databuf = new byte[1024];
    private int skipped = 0;
    private int available = 0;

    public static final int nextTwoPow(int i) {
        int i2 = i | (i >> 1);
        int i3 = i2 | (i2 >> 2);
        int i4 = i3 | (i3 >> 4);
        int i5 = i4 | (i4 >> 8);
        return (i5 | (i5 >> 16)) + 1;
    }

    public void addData(byte[] bArr, int i, int i2) {
        if (this.skipped + this.available + i2 > this.databuf.length) {
            byte[] bArr2 = new byte[nextTwoPow(bArr.length)];
            System.arraycopy(this.databuf, this.skipped, bArr2, 0, this.available);
            this.skipped = 0;
            this.databuf = bArr2;
        }
        System.arraycopy(bArr, i, this.databuf, this.skipped + this.available, i2);
        this.available += i2;
    }

    public void read(byte[] bArr, int i, int i2, int i3) {
        if (this.available - i3 >= i2) {
            if (bArr.length - i >= i2) {
                System.arraycopy(this.databuf, this.skipped + i3, bArr, i, i2);
                return;
            }
            StringBuilder m253r = outline.m253r("Buffer size of ");
            m253r.append(bArr.length);
            m253r.append(" is too small for a read of ");
            m253r.append(i2);
            m253r.append(" bytes");
            throw new TlsRuntimeException(m253r.toString());
        }
        throw new TlsRuntimeException("Not enough data to read");
    }

    public void removeData(int i) {
        int i2 = this.available;
        if (i <= i2) {
            int i3 = i2 - i;
            this.available = i3;
            int i4 = this.skipped + i;
            this.skipped = i4;
            byte[] bArr = this.databuf;
            if (i4 > bArr.length / 2) {
                System.arraycopy(bArr, i4, bArr, 0, i3);
                this.skipped = 0;
                return;
            }
            return;
        }
        throw new TlsRuntimeException("Cannot remove " + i + " bytes, only got " + this.available);
    }

    public int size() {
        return this.available;
    }
}
