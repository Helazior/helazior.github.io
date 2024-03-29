package org.spongycastle.asn1.cms;

import org.spongycastle.asn1.ASN1Encodable;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.DERSequence;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class OtherKeyAttribute extends ASN1Object {
    private ASN1Encodable keyAttr;
    private ASN1ObjectIdentifier keyAttrId;

    public OtherKeyAttribute(ASN1Sequence aSN1Sequence) {
        this.keyAttrId = (ASN1ObjectIdentifier) aSN1Sequence.getObjectAt(0);
        this.keyAttr = aSN1Sequence.getObjectAt(1);
    }

    public static OtherKeyAttribute getInstance(Object obj) {
        if (obj != null && !(obj instanceof OtherKeyAttribute)) {
            if (obj instanceof ASN1Sequence) {
                return new OtherKeyAttribute((ASN1Sequence) obj);
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("unknown object in factory: ")));
        }
        return (OtherKeyAttribute) obj;
    }

    public ASN1Encodable getKeyAttr() {
        return this.keyAttr;
    }

    public ASN1ObjectIdentifier getKeyAttrId() {
        return this.keyAttrId;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.keyAttrId);
        aSN1EncodableVector.add(this.keyAttr);
        return new DERSequence(aSN1EncodableVector);
    }

    public OtherKeyAttribute(ASN1ObjectIdentifier aSN1ObjectIdentifier, ASN1Encodable aSN1Encodable) {
        this.keyAttrId = aSN1ObjectIdentifier;
        this.keyAttr = aSN1Encodable;
    }
}
