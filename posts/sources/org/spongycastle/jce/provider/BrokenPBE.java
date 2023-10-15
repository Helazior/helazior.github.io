package org.spongycastle.jce.provider;

import java.security.spec.AlgorithmParameterSpec;
import javax.crypto.spec.PBEParameterSpec;
import org.spongycastle.crypto.CipherParameters;
import org.spongycastle.crypto.PBEParametersGenerator;
import org.spongycastle.crypto.digests.MD5Digest;
import org.spongycastle.crypto.digests.RIPEMD160Digest;
import org.spongycastle.crypto.digests.SHA1Digest;
import org.spongycastle.crypto.generators.PKCS12ParametersGenerator;
import org.spongycastle.crypto.generators.PKCS5S1ParametersGenerator;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.params.KeyParameter;
import org.spongycastle.crypto.params.ParametersWithIV;
import org.spongycastle.jcajce.provider.symmetric.util.BCPBEKey;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public interface BrokenPBE {
    public static final int MD5 = 0;
    public static final int OLD_PKCS12 = 3;
    public static final int PKCS12 = 2;
    public static final int PKCS5S1 = 0;
    public static final int PKCS5S2 = 1;
    public static final int RIPEMD160 = 2;
    public static final int SHA1 = 1;

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class Util {
        private static PBEParametersGenerator makePBEGenerator(int i, int i2) {
            if (i == 0) {
                if (i2 != 0) {
                    if (i2 == 1) {
                        return new PKCS5S1ParametersGenerator(new SHA1Digest());
                    }
                    throw new IllegalStateException("PKCS5 scheme 1 only supports only MD5 and SHA1.");
                }
                return new PKCS5S1ParametersGenerator(new MD5Digest());
            } else if (i == 1) {
                return new PKCS5S2ParametersGenerator();
            } else {
                if (i == 3) {
                    if (i2 != 0) {
                        if (i2 != 1) {
                            if (i2 == 2) {
                                return new OldPKCS12ParametersGenerator(new RIPEMD160Digest());
                            }
                            throw new IllegalStateException("unknown digest scheme for PBE encryption.");
                        }
                        return new OldPKCS12ParametersGenerator(new SHA1Digest());
                    }
                    return new OldPKCS12ParametersGenerator(new MD5Digest());
                } else if (i2 != 0) {
                    if (i2 != 1) {
                        if (i2 == 2) {
                            return new PKCS12ParametersGenerator(new RIPEMD160Digest());
                        }
                        throw new IllegalStateException("unknown digest scheme for PBE encryption.");
                    }
                    return new PKCS12ParametersGenerator(new SHA1Digest());
                } else {
                    return new PKCS12ParametersGenerator(new MD5Digest());
                }
            }
        }

        public static CipherParameters makePBEMacParameters(BCPBEKey bCPBEKey, AlgorithmParameterSpec algorithmParameterSpec, int i, int i2, int i3) {
            if (algorithmParameterSpec != null && (algorithmParameterSpec instanceof PBEParameterSpec)) {
                PBEParameterSpec pBEParameterSpec = (PBEParameterSpec) algorithmParameterSpec;
                PBEParametersGenerator makePBEGenerator = makePBEGenerator(i, i2);
                byte[] encoded = bCPBEKey.getEncoded();
                makePBEGenerator.init(encoded, pBEParameterSpec.getSalt(), pBEParameterSpec.getIterationCount());
                CipherParameters generateDerivedMacParameters = makePBEGenerator.generateDerivedMacParameters(i3);
                for (int i4 = 0; i4 != encoded.length; i4++) {
                    encoded[i4] = 0;
                }
                return generateDerivedMacParameters;
            }
            throw new IllegalArgumentException("Need a PBEParameter spec with a PBE key.");
        }

        public static CipherParameters makePBEParameters(BCPBEKey bCPBEKey, AlgorithmParameterSpec algorithmParameterSpec, int i, int i2, String str, int i3, int i4) {
            CipherParameters generateDerivedParameters;
            if (algorithmParameterSpec != null && (algorithmParameterSpec instanceof PBEParameterSpec)) {
                PBEParameterSpec pBEParameterSpec = (PBEParameterSpec) algorithmParameterSpec;
                PBEParametersGenerator makePBEGenerator = makePBEGenerator(i, i2);
                byte[] encoded = bCPBEKey.getEncoded();
                makePBEGenerator.init(encoded, pBEParameterSpec.getSalt(), pBEParameterSpec.getIterationCount());
                if (i4 != 0) {
                    generateDerivedParameters = makePBEGenerator.generateDerivedParameters(i3, i4);
                } else {
                    generateDerivedParameters = makePBEGenerator.generateDerivedParameters(i3);
                }
                if (str.startsWith("DES")) {
                    if (generateDerivedParameters instanceof ParametersWithIV) {
                        setOddParity(((KeyParameter) ((ParametersWithIV) generateDerivedParameters).getParameters()).getKey());
                    } else {
                        setOddParity(((KeyParameter) generateDerivedParameters).getKey());
                    }
                }
                for (int i5 = 0; i5 != encoded.length; i5++) {
                    encoded[i5] = 0;
                }
                return generateDerivedParameters;
            }
            throw new IllegalArgumentException("Need a PBEParameter spec with a PBE key.");
        }

        private static void setOddParity(byte[] bArr) {
            for (int i = 0; i < bArr.length; i++) {
                byte b = bArr[i];
                bArr[i] = (byte) ((((b >> 7) ^ ((((((b >> 1) ^ (b >> 2)) ^ (b >> 3)) ^ (b >> 4)) ^ (b >> 5)) ^ (b >> 6))) ^ 1) | (b & 254));
            }
        }
    }
}
