package org.spongycastle.x509.examples;

import java.io.PrintStream;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Security;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Date;
import java.util.Hashtable;
import java.util.Vector;
import org.spongycastle.asn1.ASN1Encodable;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.DERObjectIdentifier;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.misc.MiscObjectIdentifiers;
import org.spongycastle.asn1.misc.NetscapeCertType;
import org.spongycastle.asn1.x509.GeneralName;
import org.spongycastle.asn1.x509.X509Name;
import org.spongycastle.jce.X509Principal;
import org.spongycastle.jce.provider.BouncyCastleProvider;
import org.spongycastle.x509.AttributeCertificateHolder;
import org.spongycastle.x509.AttributeCertificateIssuer;
import org.spongycastle.x509.X509Attribute;
import org.spongycastle.x509.X509V1CertificateGenerator;
import org.spongycastle.x509.X509V2AttributeCertificate;
import org.spongycastle.x509.X509V2AttributeCertificateGenerator;
import org.spongycastle.x509.X509V3CertificateGenerator;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class AttrCertExample {
    public static X509V1CertificateGenerator v1CertGen = new X509V1CertificateGenerator();
    public static X509V3CertificateGenerator v3CertGen = new X509V3CertificateGenerator();

    public static X509Certificate createAcIssuerCert(PublicKey publicKey, PrivateKey privateKey) {
        v1CertGen.setSerialNumber(BigInteger.valueOf(10L));
        v1CertGen.setIssuerDN(new X509Principal("C=AU, O=The Legion of the Bouncy Castle, OU=Bouncy Primary Certificate"));
        v1CertGen.setNotBefore(new Date(System.currentTimeMillis() - 2592000000L));
        v1CertGen.setNotAfter(new Date(System.currentTimeMillis() + 2592000000L));
        v1CertGen.setSubjectDN(new X509Principal("C=AU, O=The Legion of the Bouncy Castle, OU=Bouncy Primary Certificate"));
        v1CertGen.setPublicKey(publicKey);
        v1CertGen.setSignatureAlgorithm("SHA1WithRSAEncryption");
        X509Certificate generate = v1CertGen.generate(privateKey);
        generate.checkValidity(new Date());
        generate.verify(publicKey);
        return generate;
    }

    public static X509Certificate createClientCert(PublicKey publicKey, PrivateKey privateKey, PublicKey publicKey2) {
        Hashtable hashtable = new Hashtable();
        Vector vector = new Vector();
        ASN1ObjectIdentifier aSN1ObjectIdentifier = X509Name.f5698C;
        hashtable.put(aSN1ObjectIdentifier, "AU");
        ASN1ObjectIdentifier aSN1ObjectIdentifier2 = X509Name.f5703O;
        hashtable.put(aSN1ObjectIdentifier2, "The Legion of the Bouncy Castle");
        ASN1ObjectIdentifier aSN1ObjectIdentifier3 = X509Name.f5702L;
        hashtable.put(aSN1ObjectIdentifier3, "Melbourne");
        ASN1ObjectIdentifier aSN1ObjectIdentifier4 = X509Name.f5699CN;
        hashtable.put(aSN1ObjectIdentifier4, "Eric H. Echidna");
        ASN1ObjectIdentifier aSN1ObjectIdentifier5 = X509Name.EmailAddress;
        hashtable.put(aSN1ObjectIdentifier5, "feedback-crypto@spongycastle.org");
        vector.addElement(aSN1ObjectIdentifier);
        vector.addElement(aSN1ObjectIdentifier2);
        vector.addElement(aSN1ObjectIdentifier3);
        vector.addElement(aSN1ObjectIdentifier4);
        vector.addElement(aSN1ObjectIdentifier5);
        v3CertGen.reset();
        v3CertGen.setSerialNumber(BigInteger.valueOf(20L));
        v3CertGen.setIssuerDN(new X509Principal("C=AU, O=The Legion of the Bouncy Castle, OU=Bouncy Primary Certificate"));
        v3CertGen.setNotBefore(new Date(System.currentTimeMillis() - 2592000000L));
        v3CertGen.setNotAfter(new Date(System.currentTimeMillis() + 2592000000L));
        v3CertGen.setSubjectDN(new X509Principal(vector, hashtable));
        v3CertGen.setPublicKey(publicKey);
        v3CertGen.setSignatureAlgorithm("SHA1WithRSAEncryption");
        v3CertGen.addExtension((DERObjectIdentifier) MiscObjectIdentifiers.netscapeCertType, false, (ASN1Encodable) new NetscapeCertType(48));
        X509Certificate generate = v3CertGen.generate(privateKey);
        generate.checkValidity(new Date());
        generate.verify(publicKey2);
        return generate;
    }

    public static void main(String[] strArr) {
        Security.addProvider(new BouncyCastleProvider());
        RSAPublicKeySpec rSAPublicKeySpec = new RSAPublicKeySpec(new BigInteger("b4a7e46170574f16a97082b22be58b6a2a629798419be12872a4bdba626cfae9900f76abfb12139dce5de56564fab2b6543165a040c606887420e33d91ed7ed7", 16), new BigInteger("11", 16));
        RSAPrivateCrtKeySpec rSAPrivateCrtKeySpec = new RSAPrivateCrtKeySpec(new BigInteger("b4a7e46170574f16a97082b22be58b6a2a629798419be12872a4bdba626cfae9900f76abfb12139dce5de56564fab2b6543165a040c606887420e33d91ed7ed7", 16), new BigInteger("11", 16), new BigInteger("9f66f6b05410cd503b2709e88115d55daced94d1a34d4e32bf824d0dde6028ae79c5f07b580f5dce240d7111f7ddb130a7945cd7d957d1920994da389f490c89", 16), new BigInteger("c0a0758cdf14256f78d4708c86becdead1b50ad4ad6c5c703e2168fbf37884cb", 16), new BigInteger("f01734d7960ea60070f1b06f2bb81bfac48ff192ae18451d5e56c734a5aab8a5", 16), new BigInteger("b54bb9edff22051d9ee60f9351a48591b6500a319429c069a3e335a1d6171391", 16), new BigInteger("d3d83daf2a0cecd3367ae6f8ae1aeb82e9ac2f816c6fc483533d8297dd7884cd", 16), new BigInteger("b8f52fc6f38593dabb661d3f50f8897f8106eee68b1bce78a95b132b4e5b5d19", 16));
        RSAPublicKeySpec rSAPublicKeySpec2 = new RSAPublicKeySpec(new BigInteger("b259d2d6e627a768c94be36164c2d9fc79d97aab9253140e5bf17751197731d6f7540d2509e7b9ffee0a70a6e26d56e92d2edd7f85aba85600b69089f35f6bdbf3c298e05842535d9f064e6b0391cb7d306e0a2d20c4dfb4e7b49a9640bdea26c10ad69c3f05007ce2513cee44cfe01998e62b6c3637d3fc0391079b26ee36d5", 16), new BigInteger("11", 16));
        RSAPrivateCrtKeySpec rSAPrivateCrtKeySpec2 = new RSAPrivateCrtKeySpec(new BigInteger("b259d2d6e627a768c94be36164c2d9fc79d97aab9253140e5bf17751197731d6f7540d2509e7b9ffee0a70a6e26d56e92d2edd7f85aba85600b69089f35f6bdbf3c298e05842535d9f064e6b0391cb7d306e0a2d20c4dfb4e7b49a9640bdea26c10ad69c3f05007ce2513cee44cfe01998e62b6c3637d3fc0391079b26ee36d5", 16), new BigInteger("11", 16), new BigInteger("92e08f83cc9920746989ca5034dcb384a094fb9c5a6288fcc4304424ab8f56388f72652d8fafc65a4b9020896f2cde297080f2a540e7b7ce5af0b3446e1258d1dd7f245cf54124b4c6e17da21b90a0ebd22605e6f45c9f136d7a13eaac1c0f7487de8bd6d924972408ebb58af71e76fd7b012a8d0e165f3ae2e5077a8648e619", 16), new BigInteger("f75e80839b9b9379f1cf1128f321639757dba514642c206bbbd99f9a4846208b3e93fbbe5e0527cc59b1d4b929d9555853004c7c8b30ee6a213c3d1bb7415d03", 16), new BigInteger("b892d9ebdbfc37e397256dd8a5d3123534d1f03726284743ddc6be3a709edb696fc40c7d902ed804c6eee730eee3d5b20bf6bd8d87a296813c87d3b3cc9d7947", 16), new BigInteger("1d1a2d3ca8e52068b3094d501c9a842fec37f54db16e9a67070a8b3f53cc03d4257ad252a1a640eadd603724d7bf3737914b544ae332eedf4f34436cac25ceb5", 16), new BigInteger("6c929e4e81672fef49d9c825163fec97c4b7ba7acb26c0824638ac22605d7201c94625770984f78a56e6e25904fe7db407099cad9b14588841b94f5ab498dded", 16), new BigInteger("dae7651ee69ad1d081ec5e7188ae126f6004ff39556bde90e0b870962fa7b926d070686d8244fe5a9aa709a95686a104614834b0ada4b10f53197a5cb4c97339", 16));
        KeyFactory keyFactory = KeyFactory.getInstance("RSA", "SC");
        PrivateKey generatePrivate = keyFactory.generatePrivate(rSAPrivateCrtKeySpec2);
        PublicKey generatePublic = keyFactory.generatePublic(rSAPublicKeySpec2);
        keyFactory.generatePrivate(rSAPrivateCrtKeySpec);
        PublicKey generatePublic2 = keyFactory.generatePublic(rSAPublicKeySpec);
        X509Certificate createAcIssuerCert = createAcIssuerCert(generatePublic, generatePrivate);
        X509Certificate createClientCert = createClientCert(generatePublic2, generatePrivate, generatePublic);
        X509V2AttributeCertificateGenerator x509V2AttributeCertificateGenerator = new X509V2AttributeCertificateGenerator();
        x509V2AttributeCertificateGenerator.reset();
        x509V2AttributeCertificateGenerator.setHolder(new AttributeCertificateHolder(createClientCert));
        x509V2AttributeCertificateGenerator.setIssuer(new AttributeCertificateIssuer(createAcIssuerCert.getSubjectX500Principal()));
        x509V2AttributeCertificateGenerator.setSerialNumber(new BigInteger("1"));
        x509V2AttributeCertificateGenerator.setNotBefore(new Date(System.currentTimeMillis() - 50000));
        x509V2AttributeCertificateGenerator.setNotAfter(new Date(System.currentTimeMillis() + 50000));
        x509V2AttributeCertificateGenerator.setSignatureAlgorithm("SHA1WithRSAEncryption");
        GeneralName generalName = new GeneralName(1, "DAU123456789");
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(generalName);
        x509V2AttributeCertificateGenerator.addAttribute(new X509Attribute("2.5.24.72", new DERSequence(aSN1EncodableVector)));
        X509V2AttributeCertificate x509V2AttributeCertificate = (X509V2AttributeCertificate) x509V2AttributeCertificateGenerator.generate(generatePrivate, "SC");
        AttributeCertificateHolder holder = x509V2AttributeCertificate.getHolder();
        if (holder.match((Certificate) createClientCert)) {
            if (holder.getEntityNames() != null) {
                System.out.println(holder.getEntityNames().length + " entity names found");
            }
            if (holder.getIssuer() != null) {
                System.out.println(holder.getIssuer().length + " issuer names found, serial number " + holder.getSerialNumber());
            }
            System.out.println("Matches original client x509 cert");
        }
        AttributeCertificateIssuer issuer = x509V2AttributeCertificate.getIssuer();
        if (issuer.match((Certificate) createAcIssuerCert)) {
            if (issuer.getPrincipals() != null) {
                System.out.println(issuer.getPrincipals().length + " entity names found");
            }
            System.out.println("Matches original ca x509 cert");
        }
        PrintStream printStream = System.out;
        StringBuilder m253r = outline.m253r("valid not before: ");
        m253r.append(x509V2AttributeCertificate.getNotBefore());
        printStream.println(m253r.toString());
        PrintStream printStream2 = System.out;
        StringBuilder m253r2 = outline.m253r("valid not before: ");
        m253r2.append(x509V2AttributeCertificate.getNotAfter());
        printStream2.println(m253r2.toString());
        try {
            x509V2AttributeCertificate.checkValidity();
            x509V2AttributeCertificate.checkValidity(new Date());
        } catch (Exception e) {
            System.out.println(e);
        }
        try {
            x509V2AttributeCertificate.verify(generatePublic, "SC");
        } catch (Exception e2) {
            System.out.println(e2);
        }
        X509Attribute[] attributes = x509V2AttributeCertificate.getAttributes();
        PrintStream printStream3 = System.out;
        StringBuilder m253r3 = outline.m253r("cert has ");
        m253r3.append(attributes.length);
        m253r3.append(" attributes:");
        printStream3.println(m253r3.toString());
        for (X509Attribute x509Attribute : attributes) {
            PrintStream printStream4 = System.out;
            StringBuilder m253r4 = outline.m253r("OID: ");
            m253r4.append(x509Attribute.getOID());
            printStream4.println(m253r4.toString());
            if (x509Attribute.getOID().equals("2.5.24.72")) {
                System.out.println("rolesyntax read from cert!");
            }
        }
    }
}
