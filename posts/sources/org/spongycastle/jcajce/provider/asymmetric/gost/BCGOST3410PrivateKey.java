package org.spongycastle.jcajce.provider.asymmetric.gost;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.math.BigInteger;
import java.util.Enumeration;
import org.spongycastle.asn1.ASN1Encodable;
import org.spongycastle.asn1.ASN1Encoding;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.ASN1OctetString;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.DERObjectIdentifier;
import org.spongycastle.asn1.DEROctetString;
import org.spongycastle.asn1.cryptopro.CryptoProObjectIdentifiers;
import org.spongycastle.asn1.cryptopro.GOST3410PublicKeyAlgParameters;
import org.spongycastle.asn1.pkcs.PrivateKeyInfo;
import org.spongycastle.asn1.x509.AlgorithmIdentifier;
import org.spongycastle.crypto.params.GOST3410PrivateKeyParameters;
import org.spongycastle.jcajce.provider.asymmetric.util.PKCS12BagAttributeCarrierImpl;
import org.spongycastle.jce.interfaces.GOST3410Params;
import org.spongycastle.jce.interfaces.GOST3410PrivateKey;
import org.spongycastle.jce.interfaces.PKCS12BagAttributeCarrier;
import org.spongycastle.jce.spec.GOST3410ParameterSpec;
import org.spongycastle.jce.spec.GOST3410PrivateKeySpec;
import org.spongycastle.jce.spec.GOST3410PublicKeyParameterSetSpec;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class BCGOST3410PrivateKey implements GOST3410PrivateKey, PKCS12BagAttributeCarrier {
    public static final long serialVersionUID = 8581661527592305464L;
    private transient PKCS12BagAttributeCarrier attrCarrier = new PKCS12BagAttributeCarrierImpl();
    private transient GOST3410Params gost3410Spec;

    /* renamed from: x */
    private BigInteger f6091x;

    public BCGOST3410PrivateKey() {
    }

    private boolean compareObj(Object obj, Object obj2) {
        if (obj == obj2) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        return obj.equals(obj2);
    }

    private void readObject(ObjectInputStream objectInputStream) {
        objectInputStream.defaultReadObject();
        String str = (String) objectInputStream.readObject();
        if (str != null) {
            this.gost3410Spec = new GOST3410ParameterSpec(str, (String) objectInputStream.readObject(), (String) objectInputStream.readObject());
        } else {
            this.gost3410Spec = new GOST3410ParameterSpec(new GOST3410PublicKeyParameterSetSpec((BigInteger) objectInputStream.readObject(), (BigInteger) objectInputStream.readObject(), (BigInteger) objectInputStream.readObject()));
            objectInputStream.readObject();
            objectInputStream.readObject();
        }
        this.attrCarrier = new PKCS12BagAttributeCarrierImpl();
    }

    private void writeObject(ObjectOutputStream objectOutputStream) {
        objectOutputStream.defaultWriteObject();
        if (this.gost3410Spec.getPublicKeyParamSetOID() != null) {
            objectOutputStream.writeObject(this.gost3410Spec.getPublicKeyParamSetOID());
            objectOutputStream.writeObject(this.gost3410Spec.getDigestParamSetOID());
            objectOutputStream.writeObject(this.gost3410Spec.getEncryptionParamSetOID());
            return;
        }
        objectOutputStream.writeObject(null);
        objectOutputStream.writeObject(this.gost3410Spec.getPublicKeyParameters().getP());
        objectOutputStream.writeObject(this.gost3410Spec.getPublicKeyParameters().getQ());
        objectOutputStream.writeObject(this.gost3410Spec.getPublicKeyParameters().getA());
        objectOutputStream.writeObject(this.gost3410Spec.getDigestParamSetOID());
        objectOutputStream.writeObject(this.gost3410Spec.getEncryptionParamSetOID());
    }

    public boolean equals(Object obj) {
        if (obj instanceof GOST3410PrivateKey) {
            GOST3410PrivateKey gOST3410PrivateKey = (GOST3410PrivateKey) obj;
            return getX().equals(gOST3410PrivateKey.getX()) && getParameters().getPublicKeyParameters().equals(gOST3410PrivateKey.getParameters().getPublicKeyParameters()) && getParameters().getDigestParamSetOID().equals(gOST3410PrivateKey.getParameters().getDigestParamSetOID()) && compareObj(getParameters().getEncryptionParamSetOID(), gOST3410PrivateKey.getParameters().getEncryptionParamSetOID());
        }
        return false;
    }

    @Override // java.security.Key
    public String getAlgorithm() {
        return "GOST3410";
    }

    @Override // org.spongycastle.jce.interfaces.PKCS12BagAttributeCarrier
    public ASN1Encodable getBagAttribute(DERObjectIdentifier dERObjectIdentifier) {
        return this.attrCarrier.getBagAttribute(dERObjectIdentifier);
    }

    @Override // org.spongycastle.jce.interfaces.PKCS12BagAttributeCarrier
    public Enumeration getBagAttributeKeys() {
        return this.attrCarrier.getBagAttributeKeys();
    }

    @Override // java.security.Key
    public byte[] getEncoded() {
        byte[] bArr;
        PrivateKeyInfo privateKeyInfo;
        byte[] byteArray = getX().toByteArray();
        if (byteArray[0] == 0) {
            bArr = new byte[byteArray.length - 1];
        } else {
            bArr = new byte[byteArray.length];
        }
        for (int i = 0; i != bArr.length; i++) {
            bArr[i] = byteArray[(byteArray.length - 1) - i];
        }
        try {
            if (this.gost3410Spec instanceof GOST3410ParameterSpec) {
                privateKeyInfo = new PrivateKeyInfo(new AlgorithmIdentifier(CryptoProObjectIdentifiers.gostR3410_94, (ASN1Encodable) new GOST3410PublicKeyAlgParameters(new ASN1ObjectIdentifier(this.gost3410Spec.getPublicKeyParamSetOID()), new ASN1ObjectIdentifier(this.gost3410Spec.getDigestParamSetOID()))), new DEROctetString(bArr));
            } else {
                privateKeyInfo = new PrivateKeyInfo(new AlgorithmIdentifier(CryptoProObjectIdentifiers.gostR3410_94), new DEROctetString(bArr));
            }
            return privateKeyInfo.getEncoded(ASN1Encoding.DER);
        } catch (IOException unused) {
            return null;
        }
    }

    @Override // java.security.Key
    public String getFormat() {
        return "PKCS#8";
    }

    @Override // org.spongycastle.jce.interfaces.GOST3410Key
    public GOST3410Params getParameters() {
        return this.gost3410Spec;
    }

    @Override // org.spongycastle.jce.interfaces.GOST3410PrivateKey
    public BigInteger getX() {
        return this.f6091x;
    }

    public int hashCode() {
        return getX().hashCode() ^ this.gost3410Spec.hashCode();
    }

    @Override // org.spongycastle.jce.interfaces.PKCS12BagAttributeCarrier
    public void setBagAttribute(ASN1ObjectIdentifier aSN1ObjectIdentifier, ASN1Encodable aSN1Encodable) {
        this.attrCarrier.setBagAttribute(aSN1ObjectIdentifier, aSN1Encodable);
    }

    public BCGOST3410PrivateKey(GOST3410PrivateKey gOST3410PrivateKey) {
        this.f6091x = gOST3410PrivateKey.getX();
        this.gost3410Spec = gOST3410PrivateKey.getParameters();
    }

    public BCGOST3410PrivateKey(GOST3410PrivateKeySpec gOST3410PrivateKeySpec) {
        this.f6091x = gOST3410PrivateKeySpec.getX();
        this.gost3410Spec = new GOST3410ParameterSpec(new GOST3410PublicKeyParameterSetSpec(gOST3410PrivateKeySpec.getP(), gOST3410PrivateKeySpec.getQ(), gOST3410PrivateKeySpec.getA()));
    }

    public BCGOST3410PrivateKey(PrivateKeyInfo privateKeyInfo) {
        GOST3410PublicKeyAlgParameters gOST3410PublicKeyAlgParameters = new GOST3410PublicKeyAlgParameters((ASN1Sequence) privateKeyInfo.getAlgorithmId().getParameters());
        byte[] octets = ASN1OctetString.getInstance(privateKeyInfo.parsePrivateKey()).getOctets();
        byte[] bArr = new byte[octets.length];
        for (int i = 0; i != octets.length; i++) {
            bArr[i] = octets[(octets.length - 1) - i];
        }
        this.f6091x = new BigInteger(1, bArr);
        this.gost3410Spec = GOST3410ParameterSpec.fromPublicKeyAlg(gOST3410PublicKeyAlgParameters);
    }

    public BCGOST3410PrivateKey(GOST3410PrivateKeyParameters gOST3410PrivateKeyParameters, GOST3410ParameterSpec gOST3410ParameterSpec) {
        this.f6091x = gOST3410PrivateKeyParameters.getX();
        this.gost3410Spec = gOST3410ParameterSpec;
        if (gOST3410ParameterSpec == null) {
            throw new IllegalArgumentException("spec is null");
        }
    }
}
