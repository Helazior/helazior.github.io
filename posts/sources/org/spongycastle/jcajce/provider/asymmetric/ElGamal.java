package org.spongycastle.jcajce.provider.asymmetric;

import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.oiw.OIWObjectIdentifiers;
import org.spongycastle.jcajce.provider.asymmetric.elgamal.KeyFactorySpi;
import org.spongycastle.jcajce.provider.config.ConfigurableProvider;
import org.spongycastle.jcajce.provider.util.AsymmetricAlgorithmProvider;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ElGamal {
    private static final String PREFIX = "org.spongycastle.jcajce.provider.asymmetric.elgamal.";

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class Mappings extends AsymmetricAlgorithmProvider {
        @Override // org.spongycastle.jcajce.provider.util.AlgorithmProvider
        public void configure(ConfigurableProvider configurableProvider) {
            configurableProvider.addAlgorithm("AlgorithmParameterGenerator.ELGAMAL", "org.spongycastle.jcajce.provider.asymmetric.elgamal.AlgorithmParameterGeneratorSpi");
            configurableProvider.addAlgorithm("AlgorithmParameterGenerator.ElGamal", "org.spongycastle.jcajce.provider.asymmetric.elgamal.AlgorithmParameterGeneratorSpi");
            configurableProvider.addAlgorithm("AlgorithmParameters.ELGAMAL", "org.spongycastle.jcajce.provider.asymmetric.elgamal.AlgorithmParametersSpi");
            configurableProvider.addAlgorithm("AlgorithmParameters.ElGamal", "org.spongycastle.jcajce.provider.asymmetric.elgamal.AlgorithmParametersSpi");
            configurableProvider.addAlgorithm("Cipher.ELGAMAL", "org.spongycastle.jcajce.provider.asymmetric.elgamal.CipherSpi$NoPadding");
            configurableProvider.addAlgorithm("Cipher.ElGamal", "org.spongycastle.jcajce.provider.asymmetric.elgamal.CipherSpi$NoPadding");
            configurableProvider.addAlgorithm("Alg.Alias.Cipher.ELGAMAL/ECB/PKCS1PADDING", "ELGAMAL/PKCS1");
            configurableProvider.addAlgorithm("Alg.Alias.Cipher.ELGAMAL/NONE/PKCS1PADDING", "ELGAMAL/PKCS1");
            configurableProvider.addAlgorithm("Alg.Alias.Cipher.ELGAMAL/NONE/NOPADDING", "ELGAMAL");
            configurableProvider.addAlgorithm("Cipher.ELGAMAL/PKCS1", "org.spongycastle.jcajce.provider.asymmetric.elgamal.CipherSpi$PKCS1v1_5Padding");
            configurableProvider.addAlgorithm("KeyFactory.ELGAMAL", "org.spongycastle.jcajce.provider.asymmetric.elgamal.KeyFactorySpi");
            configurableProvider.addAlgorithm("KeyFactory.ElGamal", "org.spongycastle.jcajce.provider.asymmetric.elgamal.KeyFactorySpi");
            configurableProvider.addAlgorithm("KeyPairGenerator.ELGAMAL", "org.spongycastle.jcajce.provider.asymmetric.elgamal.KeyPairGeneratorSpi");
            configurableProvider.addAlgorithm("KeyPairGenerator.ElGamal", "org.spongycastle.jcajce.provider.asymmetric.elgamal.KeyPairGeneratorSpi");
            KeyFactorySpi keyFactorySpi = new KeyFactorySpi();
            ASN1ObjectIdentifier aSN1ObjectIdentifier = OIWObjectIdentifiers.elGamalAlgorithm;
            registerOid(configurableProvider, aSN1ObjectIdentifier, "ELGAMAL", keyFactorySpi);
            registerOidAlgorithmParameters(configurableProvider, aSN1ObjectIdentifier, "ELGAMAL");
        }
    }
}
