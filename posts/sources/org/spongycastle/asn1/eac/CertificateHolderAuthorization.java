package org.spongycastle.asn1.eac;

import java.util.Hashtable;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1InputStream;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.DERApplicationSpecific;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CertificateHolderAuthorization extends ASN1Object {
    public static final int CVCA = 192;
    public static final int DV_DOMESTIC = 128;
    public static final int DV_FOREIGN = 64;

    /* renamed from: IS */
    public static final int f5655IS = 0;
    public static final int RADG3 = 1;
    public static final int RADG4 = 2;
    public DERApplicationSpecific accessRights;
    public ASN1ObjectIdentifier oid;
    public static final ASN1ObjectIdentifier id_role_EAC = EACObjectIdentifiers.bsi_de.branch("3.1.2.1");
    public static Hashtable RightsDecodeMap = new Hashtable();
    public static BidirectionalMap AuthorizationRole = new BidirectionalMap();
    public static Hashtable ReverseMap = new Hashtable();

    static {
        RightsDecodeMap.put(new Integer(2), "RADG4");
        RightsDecodeMap.put(new Integer(1), "RADG3");
        AuthorizationRole.put(new Integer(192), "CVCA");
        AuthorizationRole.put(new Integer(128), "DV_DOMESTIC");
        AuthorizationRole.put(new Integer(64), "DV_FOREIGN");
        AuthorizationRole.put(new Integer(0), "IS");
    }

    public CertificateHolderAuthorization(ASN1ObjectIdentifier aSN1ObjectIdentifier, int i) {
        setOid(aSN1ObjectIdentifier);
        setAccessRights((byte) i);
    }

    public static int GetFlag(String str) {
        Integer num = (Integer) AuthorizationRole.getReverse(str);
        if (num != null) {
            return num.intValue();
        }
        throw new IllegalArgumentException(outline.m266e("Unknown value ", str));
    }

    public static String GetRoleDescription(int i) {
        return (String) AuthorizationRole.get(new Integer(i));
    }

    private void setAccessRights(byte b) {
        this.accessRights = new DERApplicationSpecific(EACTags.getTag(83), new byte[]{b});
    }

    private void setOid(ASN1ObjectIdentifier aSN1ObjectIdentifier) {
        this.oid = aSN1ObjectIdentifier;
    }

    private void setPrivateData(ASN1InputStream aSN1InputStream) {
        ASN1Primitive readObject = aSN1InputStream.readObject();
        if (readObject instanceof ASN1ObjectIdentifier) {
            this.oid = (ASN1ObjectIdentifier) readObject;
            ASN1Primitive readObject2 = aSN1InputStream.readObject();
            if (readObject2 instanceof DERApplicationSpecific) {
                this.accessRights = (DERApplicationSpecific) readObject2;
                return;
            }
            throw new IllegalArgumentException("No access rights in CerticateHolderAuthorization");
        }
        throw new IllegalArgumentException("no Oid in CerticateHolderAuthorization");
    }

    public int getAccessRights() {
        return this.accessRights.getContents()[0] & 255;
    }

    public ASN1ObjectIdentifier getOid() {
        return this.oid;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.oid);
        aSN1EncodableVector.add(this.accessRights);
        return new DERApplicationSpecific(76, aSN1EncodableVector);
    }

    public CertificateHolderAuthorization(DERApplicationSpecific dERApplicationSpecific) {
        if (dERApplicationSpecific.getApplicationTag() == 76) {
            setPrivateData(new ASN1InputStream(dERApplicationSpecific.getContents()));
        }
    }
}
