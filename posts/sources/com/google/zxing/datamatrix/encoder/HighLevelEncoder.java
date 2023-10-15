package com.google.zxing.datamatrix.encoder;

import com.google.zxing.Dimension;
import java.nio.charset.Charset;
import java.util.Arrays;
import org.spongycastle.crypto.tls.CipherSuite;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class HighLevelEncoder {
    public static final int ASCII_ENCODATION = 0;
    public static final int BASE256_ENCODATION = 5;
    public static final int C40_ENCODATION = 1;
    public static final char C40_UNLATCH = 254;
    public static final int EDIFACT_ENCODATION = 4;
    public static final char LATCH_TO_ANSIX12 = 238;
    public static final char LATCH_TO_BASE256 = 231;
    public static final char LATCH_TO_C40 = 230;
    public static final char LATCH_TO_EDIFACT = 240;
    public static final char LATCH_TO_TEXT = 239;
    private static final char MACRO_05 = 236;
    private static final String MACRO_05_HEADER = "[)>\u001e05\u001d";
    private static final char MACRO_06 = 237;
    private static final String MACRO_06_HEADER = "[)>\u001e06\u001d";
    private static final String MACRO_TRAILER = "\u001e\u0004";
    private static final char PAD = 129;
    public static final int TEXT_ENCODATION = 2;
    public static final char UPPER_SHIFT = 235;
    public static final int X12_ENCODATION = 3;
    public static final char X12_UNLATCH = 254;

    private HighLevelEncoder() {
    }

    public static int determineConsecutiveDigitCount(CharSequence charSequence, int i) {
        int length = charSequence.length();
        int i2 = 0;
        if (i < length) {
            char charAt = charSequence.charAt(i);
            while (isDigit(charAt) && i < length) {
                i2++;
                i++;
                if (i < length) {
                    charAt = charSequence.charAt(i);
                }
            }
        }
        return i2;
    }

    public static String encodeHighLevel(String str) {
        return encodeHighLevel(str, SymbolShapeHint.FORCE_NONE, null, null);
    }

    private static int findMinimums(float[] fArr, int[] iArr, int i, byte[] bArr) {
        Arrays.fill(bArr, (byte) 0);
        for (int i2 = 0; i2 < 6; i2++) {
            iArr[i2] = (int) Math.ceil(fArr[i2]);
            int i3 = iArr[i2];
            if (i > i3) {
                Arrays.fill(bArr, (byte) 0);
                i = i3;
            }
            if (i == i3) {
                bArr[i2] = (byte) (bArr[i2] + 1);
            }
        }
        return i;
    }

    public static byte[] getBytesForMessage(String str) {
        return str.getBytes(Charset.forName("cp437"));
    }

    private static int getMinimumCount(byte[] bArr) {
        int i = 0;
        for (int i2 = 0; i2 < 6; i2++) {
            i += bArr[i2];
        }
        return i;
    }

    public static void illegalCharacter(char c) {
        String hexString;
        throw new IllegalArgumentException("Illegal character: " + c + " (0x" + ("0000".substring(0, 4 - hexString.length()) + Integer.toHexString(c)) + ')');
    }

    public static boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    public static boolean isExtendedASCII(char c) {
        return c >= 128 && c <= 255;
    }

    private static boolean isNativeC40(char c) {
        return c == ' ' || (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z');
    }

    private static boolean isNativeEDIFACT(char c) {
        return c >= ' ' && c <= '^';
    }

    private static boolean isNativeText(char c) {
        return c == ' ' || (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z');
    }

    private static boolean isNativeX12(char c) {
        return isX12TermSep(c) || c == ' ' || (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z');
    }

    private static boolean isSpecialB256(char c) {
        return false;
    }

    private static boolean isX12TermSep(char c) {
        return c == '\r' || c == '*' || c == '>';
    }

    public static int lookAheadTest(CharSequence charSequence, int i, int i2) {
        float[] fArr;
        char c;
        if (i >= charSequence.length()) {
            return i2;
        }
        if (i2 == 0) {
            fArr = new float[]{0.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.25f};
        } else {
            fArr = new float[]{1.0f, 2.0f, 2.0f, 2.0f, 2.0f, 2.25f};
            fArr[i2] = 0.0f;
        }
        int i3 = 0;
        while (true) {
            int i4 = i + i3;
            if (i4 == charSequence.length()) {
                byte[] bArr = new byte[6];
                int[] iArr = new int[6];
                int findMinimums = findMinimums(fArr, iArr, Integer.MAX_VALUE, bArr);
                int minimumCount = getMinimumCount(bArr);
                if (iArr[0] == findMinimums) {
                    return 0;
                }
                if (minimumCount != 1 || bArr[5] <= 0) {
                    if (minimumCount != 1 || bArr[4] <= 0) {
                        if (minimumCount != 1 || bArr[2] <= 0) {
                            return (minimumCount != 1 || bArr[3] <= 0) ? 1 : 3;
                        }
                        return 2;
                    }
                    return 4;
                }
                return 5;
            }
            char charAt = charSequence.charAt(i4);
            i3++;
            if (isDigit(charAt)) {
                fArr[0] = (float) (fArr[0] + 0.5d);
            } else if (isExtendedASCII(charAt)) {
                fArr[0] = (int) Math.ceil(fArr[0]);
                fArr[0] = fArr[0] + 2.0f;
            } else {
                fArr[0] = (int) Math.ceil(fArr[0]);
                fArr[0] = fArr[0] + 1.0f;
            }
            if (isNativeC40(charAt)) {
                fArr[1] = fArr[1] + 0.6666667f;
            } else if (isExtendedASCII(charAt)) {
                fArr[1] = fArr[1] + 2.6666667f;
            } else {
                fArr[1] = fArr[1] + 1.3333334f;
            }
            if (isNativeText(charAt)) {
                fArr[2] = fArr[2] + 0.6666667f;
            } else if (isExtendedASCII(charAt)) {
                fArr[2] = fArr[2] + 2.6666667f;
            } else {
                fArr[2] = fArr[2] + 1.3333334f;
            }
            if (isNativeX12(charAt)) {
                fArr[3] = fArr[3] + 0.6666667f;
            } else if (isExtendedASCII(charAt)) {
                fArr[3] = fArr[3] + 4.3333335f;
            } else {
                fArr[3] = fArr[3] + 3.3333333f;
            }
            if (isNativeEDIFACT(charAt)) {
                fArr[4] = fArr[4] + 0.75f;
            } else if (isExtendedASCII(charAt)) {
                fArr[4] = fArr[4] + 4.25f;
            } else {
                fArr[4] = fArr[4] + 3.25f;
            }
            if (isSpecialB256(charAt)) {
                c = 5;
                fArr[5] = fArr[5] + 4.0f;
            } else {
                c = 5;
                fArr[5] = fArr[5] + 1.0f;
            }
            if (i3 >= 4) {
                int[] iArr2 = new int[6];
                byte[] bArr2 = new byte[6];
                findMinimums(fArr, iArr2, Integer.MAX_VALUE, bArr2);
                int minimumCount2 = getMinimumCount(bArr2);
                if (iArr2[0] < iArr2[c] && iArr2[0] < iArr2[1] && iArr2[0] < iArr2[2] && iArr2[0] < iArr2[3] && iArr2[0] < iArr2[4]) {
                    return 0;
                }
                if (iArr2[5] < iArr2[0] || bArr2[1] + bArr2[2] + bArr2[3] + bArr2[4] == 0) {
                    return 5;
                }
                if (minimumCount2 == 1 && bArr2[4] > 0) {
                    return 4;
                }
                if (minimumCount2 == 1 && bArr2[2] > 0) {
                    return 2;
                }
                if (minimumCount2 == 1 && bArr2[3] > 0) {
                    return 3;
                }
                if (iArr2[1] + 1 < iArr2[0] && iArr2[1] + 1 < iArr2[5] && iArr2[1] + 1 < iArr2[4] && iArr2[1] + 1 < iArr2[2]) {
                    if (iArr2[1] < iArr2[3]) {
                        return 1;
                    }
                    if (iArr2[1] == iArr2[3]) {
                        for (int i5 = i + i3 + 1; i5 < charSequence.length(); i5++) {
                            char charAt2 = charSequence.charAt(i5);
                            if (isX12TermSep(charAt2)) {
                                return 3;
                            }
                            if (!isNativeX12(charAt2)) {
                                break;
                            }
                        }
                        return 1;
                    }
                }
            }
        }
    }

    private static char randomize253State(char c, int i) {
        int i2 = ((i * CipherSuite.TLS_RSA_PSK_WITH_AES_256_CBC_SHA) % 253) + 1 + c;
        if (i2 > 254) {
            i2 -= 254;
        }
        return (char) i2;
    }

    public static String encodeHighLevel(String str, SymbolShapeHint symbolShapeHint, Dimension dimension, Dimension dimension2) {
        int i = 0;
        Encoder[] encoderArr = {new ASCIIEncoder(), new C40Encoder(), new TextEncoder(), new X12Encoder(), new EdifactEncoder(), new Base256Encoder()};
        EncoderContext encoderContext = new EncoderContext(str);
        encoderContext.setSymbolShape(symbolShapeHint);
        encoderContext.setSizeConstraints(dimension, dimension2);
        if (str.startsWith(MACRO_05_HEADER) && str.endsWith(MACRO_TRAILER)) {
            encoderContext.writeCodeword(MACRO_05);
            encoderContext.setSkipAtEnd(2);
            encoderContext.pos += 7;
        } else if (str.startsWith(MACRO_06_HEADER) && str.endsWith(MACRO_TRAILER)) {
            encoderContext.writeCodeword(MACRO_06);
            encoderContext.setSkipAtEnd(2);
            encoderContext.pos += 7;
        }
        while (encoderContext.hasMoreCharacters()) {
            encoderArr[i].encode(encoderContext);
            int i2 = encoderContext.newEncoding;
            if (i2 >= 0) {
                encoderContext.resetEncoderSignal();
                i = i2;
            }
        }
        int length = encoderContext.codewords.length();
        encoderContext.updateSymbolInfo();
        int i3 = encoderContext.symbolInfo.dataCapacity;
        if (length < i3 && i != 0 && i != 5) {
            encoderContext.writeCodeword((char) 254);
        }
        StringBuilder sb = encoderContext.codewords;
        if (sb.length() < i3) {
            sb.append(PAD);
        }
        while (sb.length() < i3) {
            sb.append(randomize253State(PAD, sb.length() + 1));
        }
        return encoderContext.codewords.toString();
    }
}
