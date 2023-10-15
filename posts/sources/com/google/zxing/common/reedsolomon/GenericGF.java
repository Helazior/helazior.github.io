package com.google.zxing.common.reedsolomon;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class GenericGF {
    public static final GenericGF AZTEC_DATA_6;
    public static final GenericGF AZTEC_DATA_8;
    public static final GenericGF AZTEC_PARAM;
    public static final GenericGF DATA_MATRIX_FIELD_256;
    private static final int INITIALIZATION_THRESHOLD = 0;
    public static final GenericGF MAXICODE_FIELD_64;
    public static final GenericGF QR_CODE_FIELD_256;
    private int[] expTable;
    private final int generatorBase;
    private boolean initialized = false;
    private int[] logTable;
    private GenericGFPoly one;
    private final int primitive;
    private final int size;
    private GenericGFPoly zero;
    public static final GenericGF AZTEC_DATA_12 = new GenericGF(4201, 4096, 1);
    public static final GenericGF AZTEC_DATA_10 = new GenericGF(1033, 1024, 1);

    static {
        GenericGF genericGF = new GenericGF(67, 64, 1);
        AZTEC_DATA_6 = genericGF;
        AZTEC_PARAM = new GenericGF(19, 16, 1);
        QR_CODE_FIELD_256 = new GenericGF(285, 256, 0);
        GenericGF genericGF2 = new GenericGF(301, 256, 1);
        DATA_MATRIX_FIELD_256 = genericGF2;
        AZTEC_DATA_8 = genericGF2;
        MAXICODE_FIELD_64 = genericGF;
    }

    public GenericGF(int i, int i2, int i3) {
        this.primitive = i;
        this.size = i2;
        this.generatorBase = i3;
        if (i2 <= 0) {
            initialize();
        }
    }

    public static int addOrSubtract(int i, int i2) {
        return i ^ i2;
    }

    private void checkInit() {
        if (this.initialized) {
            return;
        }
        initialize();
    }

    private void initialize() {
        int i = this.size;
        this.expTable = new int[i];
        this.logTable = new int[i];
        int i2 = 0;
        int i3 = 1;
        while (true) {
            int i4 = this.size;
            if (i2 >= i4) {
                break;
            }
            this.expTable[i2] = i3;
            i3 <<= 1;
            if (i3 >= i4) {
                i3 = (i3 ^ this.primitive) & (i4 - 1);
            }
            i2++;
        }
        for (int i5 = 0; i5 < this.size - 1; i5++) {
            this.logTable[this.expTable[i5]] = i5;
        }
        this.zero = new GenericGFPoly(this, new int[]{0});
        this.one = new GenericGFPoly(this, new int[]{1});
        this.initialized = true;
    }

    public GenericGFPoly buildMonomial(int i, int i2) {
        checkInit();
        if (i >= 0) {
            if (i2 == 0) {
                return this.zero;
            }
            int[] iArr = new int[i + 1];
            iArr[0] = i2;
            return new GenericGFPoly(this, iArr);
        }
        throw new IllegalArgumentException();
    }

    public int exp(int i) {
        checkInit();
        return this.expTable[i];
    }

    public int getGeneratorBase() {
        return this.generatorBase;
    }

    public GenericGFPoly getOne() {
        checkInit();
        return this.one;
    }

    public int getSize() {
        return this.size;
    }

    public GenericGFPoly getZero() {
        checkInit();
        return this.zero;
    }

    public int inverse(int i) {
        checkInit();
        if (i != 0) {
            return this.expTable[(this.size - this.logTable[i]) - 1];
        }
        throw new ArithmeticException();
    }

    public int log(int i) {
        checkInit();
        if (i != 0) {
            return this.logTable[i];
        }
        throw new IllegalArgumentException();
    }

    public int multiply(int i, int i2) {
        checkInit();
        if (i == 0 || i2 == 0) {
            return 0;
        }
        int[] iArr = this.expTable;
        int[] iArr2 = this.logTable;
        return iArr[(iArr2[i] + iArr2[i2]) % (this.size - 1)];
    }

    public String toString() {
        StringBuilder m253r = outline.m253r("GF(0x");
        m253r.append(Integer.toHexString(this.primitive));
        m253r.append(',');
        m253r.append(this.size);
        m253r.append(')');
        return m253r.toString();
    }
}
