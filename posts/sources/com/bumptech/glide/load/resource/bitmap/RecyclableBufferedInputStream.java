package com.bumptech.glide.load.resource.bitmap;

import com.bumptech.glide.load.engine.bitmap_recycle.ArrayPool;
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class RecyclableBufferedInputStream extends FilterInputStream {
    private volatile byte[] buf;
    private final ArrayPool byteArrayPool;
    private int count;
    private int marklimit;
    private int markpos;
    private int pos;

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class InvalidMarkException extends IOException {
        private static final long serialVersionUID = -4338378848813561757L;

        public InvalidMarkException(String str) {
            super(str);
        }
    }

    public RecyclableBufferedInputStream(InputStream inputStream, ArrayPool arrayPool) {
        this(inputStream, arrayPool, 65536);
    }

    private int fillbuf(InputStream inputStream, byte[] bArr) {
        int i = this.markpos;
        if (i != -1) {
            int i2 = this.pos - i;
            int i3 = this.marklimit;
            if (i2 < i3) {
                if (i == 0 && i3 > bArr.length && this.count == bArr.length) {
                    int length = bArr.length * 2;
                    if (length <= i3) {
                        i3 = length;
                    }
                    byte[] bArr2 = (byte[]) this.byteArrayPool.get(i3, byte[].class);
                    System.arraycopy(bArr, 0, bArr2, 0, bArr.length);
                    this.buf = bArr2;
                    this.byteArrayPool.put(bArr);
                    bArr = bArr2;
                } else if (i > 0) {
                    System.arraycopy(bArr, i, bArr, 0, bArr.length - i);
                }
                int i4 = this.pos - this.markpos;
                this.pos = i4;
                this.markpos = 0;
                this.count = 0;
                int read = inputStream.read(bArr, i4, bArr.length - i4);
                int i5 = this.pos;
                if (read > 0) {
                    i5 += read;
                }
                this.count = i5;
                return read;
            }
        }
        int read2 = inputStream.read(bArr);
        if (read2 > 0) {
            this.markpos = -1;
            this.pos = 0;
            this.count = read2;
        }
        return read2;
    }

    private static IOException streamClosed() {
        throw new IOException("BufferedInputStream is closed");
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public synchronized int available() {
        InputStream inputStream;
        inputStream = ((FilterInputStream) this).in;
        if (this.buf != null && inputStream != null) {
        } else {
            throw streamClosed();
        }
        return (this.count - this.pos) + inputStream.available();
    }

    @Override // java.io.FilterInputStream, java.io.InputStream, java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        if (this.buf != null) {
            this.byteArrayPool.put(this.buf);
            this.buf = null;
        }
        InputStream inputStream = ((FilterInputStream) this).in;
        ((FilterInputStream) this).in = null;
        if (inputStream != null) {
            inputStream.close();
        }
    }

    public synchronized void fixMarkLimit() {
        this.marklimit = this.buf.length;
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public synchronized void mark(int i) {
        this.marklimit = Math.max(this.marklimit, i);
        this.markpos = this.pos;
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public boolean markSupported() {
        return true;
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public synchronized int read() {
        byte[] bArr = this.buf;
        InputStream inputStream = ((FilterInputStream) this).in;
        if (bArr != null && inputStream != null) {
            if (this.pos < this.count || fillbuf(inputStream, bArr) != -1) {
                if (bArr != this.buf && (bArr = this.buf) == null) {
                    throw streamClosed();
                }
                int i = this.count;
                int i2 = this.pos;
                if (i - i2 > 0) {
                    this.pos = i2 + 1;
                    return bArr[i2] & 255;
                }
                return -1;
            }
            return -1;
        }
        throw streamClosed();
    }

    public synchronized void release() {
        if (this.buf != null) {
            this.byteArrayPool.put(this.buf);
            this.buf = null;
        }
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public synchronized void reset() {
        if (this.buf != null) {
            int i = this.markpos;
            if (-1 != i) {
                this.pos = i;
            } else {
                throw new InvalidMarkException("Mark has been invalidated, pos: " + this.pos + " markLimit: " + this.marklimit);
            }
        } else {
            throw new IOException("Stream is closed");
        }
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public synchronized long skip(long j) {
        if (j < 1) {
            return 0L;
        }
        byte[] bArr = this.buf;
        if (bArr != null) {
            InputStream inputStream = ((FilterInputStream) this).in;
            if (inputStream != null) {
                int i = this.count;
                int i2 = this.pos;
                if (i - i2 >= j) {
                    this.pos = (int) (i2 + j);
                    return j;
                }
                long j2 = i - i2;
                this.pos = i;
                if (this.markpos != -1 && j <= this.marklimit) {
                    if (fillbuf(inputStream, bArr) == -1) {
                        return j2;
                    }
                    int i3 = this.count;
                    int i4 = this.pos;
                    if (i3 - i4 >= j - j2) {
                        this.pos = (int) ((i4 + j) - j2);
                        return j;
                    }
                    long j3 = (j2 + i3) - i4;
                    this.pos = i3;
                    return j3;
                }
                return j2 + inputStream.skip(j - j2);
            }
            throw streamClosed();
        }
        throw streamClosed();
    }

    public RecyclableBufferedInputStream(InputStream inputStream, ArrayPool arrayPool, int i) {
        super(inputStream);
        this.markpos = -1;
        this.byteArrayPool = arrayPool;
        this.buf = (byte[]) arrayPool.get(i, byte[].class);
    }

    @Override // java.io.FilterInputStream, java.io.InputStream
    public synchronized int read(byte[] bArr, int i, int i2) {
        int i3;
        int i4;
        byte[] bArr2 = this.buf;
        if (bArr2 == null) {
            throw streamClosed();
        }
        if (i2 == 0) {
            return 0;
        }
        InputStream inputStream = ((FilterInputStream) this).in;
        if (inputStream != null) {
            int i5 = this.pos;
            int i6 = this.count;
            if (i5 < i6) {
                int i7 = i6 - i5 >= i2 ? i2 : i6 - i5;
                System.arraycopy(bArr2, i5, bArr, i, i7);
                this.pos += i7;
                if (i7 == i2 || inputStream.available() == 0) {
                    return i7;
                }
                i += i7;
                i3 = i2 - i7;
            } else {
                i3 = i2;
            }
            while (true) {
                if (this.markpos == -1 && i3 >= bArr2.length) {
                    i4 = inputStream.read(bArr, i, i3);
                    if (i4 == -1) {
                        return i3 != i2 ? i2 - i3 : -1;
                    }
                } else if (fillbuf(inputStream, bArr2) == -1) {
                    return i3 != i2 ? i2 - i3 : -1;
                } else {
                    if (bArr2 != this.buf && (bArr2 = this.buf) == null) {
                        throw streamClosed();
                    }
                    int i8 = this.count;
                    int i9 = this.pos;
                    i4 = i8 - i9 >= i3 ? i3 : i8 - i9;
                    System.arraycopy(bArr2, i9, bArr, i, i4);
                    this.pos += i4;
                }
                i3 -= i4;
                if (i3 == 0) {
                    return i2;
                }
                if (inputStream.available() == 0) {
                    return i2 - i3;
                }
                i += i4;
            }
        } else {
            throw streamClosed();
        }
    }
}
