package okhttp3.internal.p007ws;

import p000.C1946ke;

/* renamed from: okhttp3.internal.ws.WebSocketProtocol */
/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class WebSocketProtocol {
    public static final String ACCEPT_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    public static final int B0_FLAG_FIN = 128;
    public static final int B0_FLAG_RSV1 = 64;
    public static final int B0_FLAG_RSV2 = 32;
    public static final int B0_FLAG_RSV3 = 16;
    public static final int B0_MASK_OPCODE = 15;
    public static final int B1_FLAG_MASK = 128;
    public static final int B1_MASK_LENGTH = 127;
    public static final int CLOSE_CLIENT_GOING_AWAY = 1001;
    public static final long CLOSE_MESSAGE_MAX = 123;
    public static final int CLOSE_NO_STATUS_CODE = 1005;
    public static final int OPCODE_BINARY = 2;
    public static final int OPCODE_CONTINUATION = 0;
    public static final int OPCODE_CONTROL_CLOSE = 8;
    public static final int OPCODE_CONTROL_PING = 9;
    public static final int OPCODE_CONTROL_PONG = 10;
    public static final int OPCODE_FLAG_CONTROL = 8;
    public static final int OPCODE_TEXT = 1;
    public static final long PAYLOAD_BYTE_MAX = 125;
    public static final int PAYLOAD_LONG = 127;
    public static final int PAYLOAD_SHORT = 126;
    public static final long PAYLOAD_SHORT_MAX = 65535;

    private WebSocketProtocol() {
        throw new AssertionError("No instances.");
    }

    public static String acceptHeader(String str) {
        return C2011ne.m557f(str + ACCEPT_MAGIC).mo551l().mo562a();
    }

    public static String closeCodeExceptionMessage(int i) {
        if (i < 1000 || i >= 5000) {
            return outline.m273H("Code must be in range [1000,5000): ", i);
        }
        if ((i < 1004 || i > 1006) && (i < 1012 || i > 2999)) {
            return null;
        }
        return "Code " + i + " is reserved and may not be used.";
    }

    public static void toggleMask(C1946ke.C1948b c1948b, byte[] bArr) {
        int m650E;
        int length = bArr.length;
        int i = 0;
        do {
            byte[] bArr2 = c1948b.f5404f;
            int i2 = c1948b.f5405g;
            int i3 = c1948b.f5406h;
            while (i2 < i3) {
                int i4 = i % length;
                bArr2[i2] = (byte) (bArr2[i2] ^ bArr[i4]);
                i2++;
                i = i4 + 1;
            }
            long j = c1948b.f5403d;
            if (j == c1948b.f5400a.f5398b) {
                throw new IllegalStateException();
            }
            if (j == -1) {
                m650E = c1948b.m650E(0L);
            } else {
                m650E = c1948b.m650E(j + (c1948b.f5406h - c1948b.f5405g));
            }
        } while (m650E != -1);
    }

    public static void validateCloseCode(int i) {
        String closeCodeExceptionMessage = closeCodeExceptionMessage(i);
        if (closeCodeExceptionMessage != null) {
            throw new IllegalArgumentException(closeCodeExceptionMessage);
        }
    }
}
