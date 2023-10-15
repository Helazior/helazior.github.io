package org.spongycastle.math.ntru.polynomial;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.SecureRandom;
import org.spongycastle.util.Arrays;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ProductFormPolynomial implements Polynomial {

    /* renamed from: f1 */
    private SparseTernaryPolynomial f6163f1;

    /* renamed from: f2 */
    private SparseTernaryPolynomial f6164f2;

    /* renamed from: f3 */
    private SparseTernaryPolynomial f6165f3;

    public ProductFormPolynomial(SparseTernaryPolynomial sparseTernaryPolynomial, SparseTernaryPolynomial sparseTernaryPolynomial2, SparseTernaryPolynomial sparseTernaryPolynomial3) {
        this.f6163f1 = sparseTernaryPolynomial;
        this.f6164f2 = sparseTernaryPolynomial2;
        this.f6165f3 = sparseTernaryPolynomial3;
    }

    public static ProductFormPolynomial fromBinary(byte[] bArr, int i, int i2, int i3, int i4, int i5) {
        return fromBinary(new ByteArrayInputStream(bArr), i, i2, i3, i4, i5);
    }

    public static ProductFormPolynomial generateRandom(int i, int i2, int i3, int i4, int i5, SecureRandom secureRandom) {
        return new ProductFormPolynomial(SparseTernaryPolynomial.generateRandom(i, i2, i2, secureRandom), SparseTernaryPolynomial.generateRandom(i, i3, i3, secureRandom), SparseTernaryPolynomial.generateRandom(i, i4, i5, secureRandom));
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj != null && getClass() == obj.getClass()) {
            ProductFormPolynomial productFormPolynomial = (ProductFormPolynomial) obj;
            SparseTernaryPolynomial sparseTernaryPolynomial = this.f6163f1;
            if (sparseTernaryPolynomial == null) {
                if (productFormPolynomial.f6163f1 != null) {
                    return false;
                }
            } else if (!sparseTernaryPolynomial.equals(productFormPolynomial.f6163f1)) {
                return false;
            }
            SparseTernaryPolynomial sparseTernaryPolynomial2 = this.f6164f2;
            if (sparseTernaryPolynomial2 == null) {
                if (productFormPolynomial.f6164f2 != null) {
                    return false;
                }
            } else if (!sparseTernaryPolynomial2.equals(productFormPolynomial.f6164f2)) {
                return false;
            }
            SparseTernaryPolynomial sparseTernaryPolynomial3 = this.f6165f3;
            if (sparseTernaryPolynomial3 == null) {
                if (productFormPolynomial.f6165f3 != null) {
                    return false;
                }
            } else if (!sparseTernaryPolynomial3.equals(productFormPolynomial.f6165f3)) {
                return false;
            }
            return true;
        }
        return false;
    }

    public int hashCode() {
        SparseTernaryPolynomial sparseTernaryPolynomial = this.f6163f1;
        int hashCode = ((sparseTernaryPolynomial == null ? 0 : sparseTernaryPolynomial.hashCode()) + 31) * 31;
        SparseTernaryPolynomial sparseTernaryPolynomial2 = this.f6164f2;
        int hashCode2 = (hashCode + (sparseTernaryPolynomial2 == null ? 0 : sparseTernaryPolynomial2.hashCode())) * 31;
        SparseTernaryPolynomial sparseTernaryPolynomial3 = this.f6165f3;
        return hashCode2 + (sparseTernaryPolynomial3 != null ? sparseTernaryPolynomial3.hashCode() : 0);
    }

    @Override // org.spongycastle.math.ntru.polynomial.Polynomial
    public IntegerPolynomial mult(IntegerPolynomial integerPolynomial) {
        IntegerPolynomial mult = this.f6164f2.mult(this.f6163f1.mult(integerPolynomial));
        mult.add(this.f6165f3.mult(integerPolynomial));
        return mult;
    }

    public byte[] toBinary() {
        byte[] binary = this.f6163f1.toBinary();
        byte[] binary2 = this.f6164f2.toBinary();
        byte[] binary3 = this.f6165f3.toBinary();
        byte[] copyOf = Arrays.copyOf(binary, binary.length + binary2.length + binary3.length);
        System.arraycopy(binary2, 0, copyOf, binary.length, binary2.length);
        System.arraycopy(binary3, 0, copyOf, binary.length + binary2.length, binary3.length);
        return copyOf;
    }

    @Override // org.spongycastle.math.ntru.polynomial.Polynomial
    public IntegerPolynomial toIntegerPolynomial() {
        IntegerPolynomial mult = this.f6163f1.mult(this.f6164f2.toIntegerPolynomial());
        mult.add(this.f6165f3.toIntegerPolynomial());
        return mult;
    }

    public static ProductFormPolynomial fromBinary(InputStream inputStream, int i, int i2, int i3, int i4, int i5) {
        return new ProductFormPolynomial(SparseTernaryPolynomial.fromBinary(inputStream, i, i2, i2), SparseTernaryPolynomial.fromBinary(inputStream, i, i3, i3), SparseTernaryPolynomial.fromBinary(inputStream, i, i4, i5));
    }

    @Override // org.spongycastle.math.ntru.polynomial.Polynomial
    public BigIntPolynomial mult(BigIntPolynomial bigIntPolynomial) {
        BigIntPolynomial mult = this.f6164f2.mult(this.f6163f1.mult(bigIntPolynomial));
        mult.add(this.f6165f3.mult(bigIntPolynomial));
        return mult;
    }

    @Override // org.spongycastle.math.ntru.polynomial.Polynomial
    public IntegerPolynomial mult(IntegerPolynomial integerPolynomial, int i) {
        IntegerPolynomial mult = mult(integerPolynomial);
        mult.mod(i);
        return mult;
    }
}
