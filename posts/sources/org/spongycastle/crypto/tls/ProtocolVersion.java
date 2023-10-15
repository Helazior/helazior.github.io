package org.spongycastle.crypto.tls;

import okhttp3.internal.http2.Settings;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ProtocolVersion {
    public static final ProtocolVersion SSLv3 = new ProtocolVersion(768);
    public static final ProtocolVersion TLSv10 = new ProtocolVersion(769);
    public static final ProtocolVersion TLSv11 = new ProtocolVersion(770);
    public static final ProtocolVersion TLSv12 = new ProtocolVersion(771);
    private int version;

    private ProtocolVersion(int i) {
        this.version = i & Settings.DEFAULT_INITIAL_WINDOW_SIZE;
    }

    public static ProtocolVersion get(int i, int i2) {
        if (i == 3) {
            if (i2 == 0) {
                return SSLv3;
            }
            if (i2 == 1) {
                return TLSv10;
            }
            if (i2 == 2) {
                return TLSv11;
            }
            if (i2 == 3) {
                return TLSv12;
            }
        }
        throw new TlsFatalAlert((short) 47);
    }

    public boolean equals(Object obj) {
        return this == obj;
    }

    public int getFullVersion() {
        return this.version;
    }

    public int getMajorVersion() {
        return this.version >> 8;
    }

    public int getMinorVersion() {
        return this.version & 255;
    }

    public int hashCode() {
        return this.version;
    }
}
