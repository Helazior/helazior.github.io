package org.spongycastle.asn1.esf;

import java.util.Enumeration;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.DERTaggedObject;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CrlOcspRef extends ASN1Object {
    private CrlListID crlids;
    private OcspListID ocspids;
    private OtherRevRefs otherRev;

    private CrlOcspRef(ASN1Sequence aSN1Sequence) {
        Enumeration objects = aSN1Sequence.getObjects();
        while (objects.hasMoreElements()) {
            DERTaggedObject dERTaggedObject = (DERTaggedObject) objects.nextElement();
            int tagNo = dERTaggedObject.getTagNo();
            if (tagNo == 0) {
                this.crlids = CrlListID.getInstance(dERTaggedObject.getObject());
            } else if (tagNo == 1) {
                this.ocspids = OcspListID.getInstance(dERTaggedObject.getObject());
            } else if (tagNo == 2) {
                this.otherRev = OtherRevRefs.getInstance(dERTaggedObject.getObject());
            } else {
                throw new IllegalArgumentException("illegal tag");
            }
        }
    }

    public static CrlOcspRef getInstance(Object obj) {
        if (obj instanceof CrlOcspRef) {
            return (CrlOcspRef) obj;
        }
        if (obj != null) {
            return new CrlOcspRef(ASN1Sequence.getInstance(obj));
        }
        return null;
    }

    public CrlListID getCrlids() {
        return this.crlids;
    }

    public OcspListID getOcspids() {
        return this.ocspids;
    }

    public OtherRevRefs getOtherRev() {
        return this.otherRev;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        CrlListID crlListID = this.crlids;
        if (crlListID != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 0, crlListID.toASN1Primitive()));
        }
        OcspListID ocspListID = this.ocspids;
        if (ocspListID != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 1, ocspListID.toASN1Primitive()));
        }
        OtherRevRefs otherRevRefs = this.otherRev;
        if (otherRevRefs != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 2, otherRevRefs.toASN1Primitive()));
        }
        return new DERSequence(aSN1EncodableVector);
    }

    public CrlOcspRef(CrlListID crlListID, OcspListID ocspListID, OtherRevRefs otherRevRefs) {
        this.crlids = crlListID;
        this.ocspids = ocspListID;
        this.otherRev = otherRevRefs;
    }
}
