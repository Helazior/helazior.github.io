package org.spongycastle.x509;

import java.io.IOException;
import java.math.BigInteger;
import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.SignatureException;
import java.util.Date;
import java.util.Iterator;
import org.spongycastle.asn1.ASN1Encodable;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Integer;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.DERBitString;
import org.spongycastle.asn1.DERGeneralizedTime;
import org.spongycastle.asn1.DERObjectIdentifier;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.x509.AlgorithmIdentifier;
import org.spongycastle.asn1.x509.AttCertIssuer;
import org.spongycastle.asn1.x509.Attribute;
import org.spongycastle.asn1.x509.AttributeCertificate;
import org.spongycastle.asn1.x509.AttributeCertificateInfo;
import org.spongycastle.asn1.x509.V2AttributeCertificateInfoGenerator;
import org.spongycastle.asn1.x509.X509ExtensionsGenerator;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class X509V2AttributeCertificateGenerator {
    private V2AttributeCertificateInfoGenerator acInfoGen = new V2AttributeCertificateInfoGenerator();
    private X509ExtensionsGenerator extGenerator = new X509ExtensionsGenerator();
    private AlgorithmIdentifier sigAlgId;
    private DERObjectIdentifier sigOID;
    private String signatureAlgorithm;

    public void addAttribute(X509Attribute x509Attribute) {
        this.acInfoGen.addAttribute(Attribute.getInstance(x509Attribute.toASN1Object()));
    }

    public void addExtension(String str, boolean z, ASN1Encodable aSN1Encodable) {
        this.extGenerator.addExtension(new ASN1ObjectIdentifier(str), z, aSN1Encodable);
    }

    public X509AttributeCertificate generate(PrivateKey privateKey, String str) {
        return generate(privateKey, str, null);
    }

    public X509AttributeCertificate generateCertificate(PrivateKey privateKey, String str) {
        return generateCertificate(privateKey, str, null);
    }

    public Iterator getSignatureAlgNames() {
        return X509Util.getAlgNames();
    }

    public void reset() {
        this.acInfoGen = new V2AttributeCertificateInfoGenerator();
        this.extGenerator.reset();
    }

    public void setHolder(AttributeCertificateHolder attributeCertificateHolder) {
        this.acInfoGen.setHolder(attributeCertificateHolder.holder);
    }

    public void setIssuer(AttributeCertificateIssuer attributeCertificateIssuer) {
        this.acInfoGen.setIssuer(AttCertIssuer.getInstance(attributeCertificateIssuer.form));
    }

    public void setIssuerUniqueId(boolean[] zArr) {
        throw new RuntimeException("not implemented (yet)");
    }

    public void setNotAfter(Date date) {
        this.acInfoGen.setEndDate(new DERGeneralizedTime(date));
    }

    public void setNotBefore(Date date) {
        this.acInfoGen.setStartDate(new DERGeneralizedTime(date));
    }

    public void setSerialNumber(BigInteger bigInteger) {
        this.acInfoGen.setSerialNumber(new ASN1Integer(bigInteger));
    }

    public void setSignatureAlgorithm(String str) {
        this.signatureAlgorithm = str;
        try {
            DERObjectIdentifier algorithmOID = X509Util.getAlgorithmOID(str);
            this.sigOID = algorithmOID;
            AlgorithmIdentifier sigAlgID = X509Util.getSigAlgID(algorithmOID, str);
            this.sigAlgId = sigAlgID;
            this.acInfoGen.setSignature(sigAlgID);
        } catch (Exception unused) {
            throw new IllegalArgumentException("Unknown signature type requested");
        }
    }

    public void addExtension(String str, boolean z, byte[] bArr) {
        this.extGenerator.addExtension(new ASN1ObjectIdentifier(str), z, bArr);
    }

    public X509AttributeCertificate generate(PrivateKey privateKey, String str, SecureRandom secureRandom) {
        if (!this.extGenerator.isEmpty()) {
            this.acInfoGen.setExtensions(this.extGenerator.generate());
        }
        AttributeCertificateInfo generateAttributeCertificateInfo = this.acInfoGen.generateAttributeCertificateInfo();
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(generateAttributeCertificateInfo);
        aSN1EncodableVector.add(this.sigAlgId);
        try {
            aSN1EncodableVector.add(new DERBitString(X509Util.calculateSignature(this.sigOID, this.signatureAlgorithm, str, privateKey, secureRandom, generateAttributeCertificateInfo)));
            return new X509V2AttributeCertificate(new AttributeCertificate(new DERSequence(aSN1EncodableVector)));
        } catch (IOException e) {
            throw new ExtCertificateEncodingException("constructed invalid certificate", e);
        }
    }

    public X509AttributeCertificate generateCertificate(PrivateKey privateKey, String str, SecureRandom secureRandom) {
        try {
            return generate(privateKey, str, secureRandom);
        } catch (InvalidKeyException e) {
            throw e;
        } catch (NoSuchProviderException e2) {
            throw e2;
        } catch (SignatureException e3) {
            throw e3;
        } catch (GeneralSecurityException e4) {
            throw new SecurityException("exception creating certificate: " + e4);
        }
    }
}
