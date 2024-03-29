package org.spongycastle.asn1;

import java.io.EOFException;
import java.io.InputStream;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class IndefiniteLengthInputStream extends LimitedInputStream {
    private int _b1;
    private int _b2;
    private boolean _eofOn00;
    private boolean _eofReached;

    public IndefiniteLengthInputStream(InputStream inputStream, int i) {
        super(inputStream, i);
        this._eofReached = false;
        this._eofOn00 = true;
        this._b1 = inputStream.read();
        int read = inputStream.read();
        this._b2 = read;
        if (read >= 0) {
            checkForEof();
            return;
        }
        throw new EOFException();
    }

    private boolean checkForEof() {
        if (!this._eofReached && this._eofOn00 && this._b1 == 0 && this._b2 == 0) {
            this._eofReached = true;
            setParentEofDetect(true);
        }
        return this._eofReached;
    }

    @Override // java.io.InputStream
    public int read(byte[] bArr, int i, int i2) {
        if (!this._eofOn00 && i2 >= 3) {
            if (this._eofReached) {
                return -1;
            }
            int read = this._in.read(bArr, i + 2, i2 - 2);
            if (read >= 0) {
                bArr[i] = (byte) this._b1;
                bArr[i + 1] = (byte) this._b2;
                this._b1 = this._in.read();
                int read2 = this._in.read();
                this._b2 = read2;
                if (read2 >= 0) {
                    return read + 2;
                }
                throw new EOFException();
            }
            throw new EOFException();
        }
        return super.read(bArr, i, i2);
    }

    public void setEofOn00(boolean z) {
        this._eofOn00 = z;
        checkForEof();
    }

    @Override // java.io.InputStream
    public int read() {
        if (checkForEof()) {
            return -1;
        }
        int read = this._in.read();
        if (read >= 0) {
            int i = this._b1;
            this._b1 = this._b2;
            this._b2 = read;
            return i;
        }
        throw new EOFException();
    }
}
