package org.spongycastle.asn1.x509;

import org.spongycastle.asn1.ASN1Choice;
import org.spongycastle.asn1.ASN1Encodable;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERTaggedObject;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class AttCertIssuer extends ASN1Object implements ASN1Choice {
    public ASN1Primitive choiceObj;
    public ASN1Encodable obj;

    public AttCertIssuer(GeneralNames generalNames) {
        this.obj = generalNames;
        this.choiceObj = generalNames.toASN1Primitive();
    }

    public static AttCertIssuer getInstance(Object obj) {
        if (obj != null && !(obj instanceof AttCertIssuer)) {
            if (obj instanceof V2Form) {
                return new AttCertIssuer(V2Form.getInstance(obj));
            }
            if (obj instanceof GeneralNames) {
                return new AttCertIssuer((GeneralNames) obj);
            }
            if (obj instanceof ASN1TaggedObject) {
                return new AttCertIssuer(V2Form.getInstance((ASN1TaggedObject) obj, false));
            }
            if (obj instanceof ASN1Sequence) {
                return new AttCertIssuer(GeneralNames.getInstance(obj));
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("unknown object in factory: ")));
        }
        return (AttCertIssuer) obj;
    }

    public ASN1Encodable getIssuer() {
        return this.obj;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        return this.choiceObj;
    }

    public AttCertIssuer(V2Form v2Form) {
        this.obj = v2Form;
        this.choiceObj = new DERTaggedObject(false, 0, v2Form);
    }

    public static AttCertIssuer getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(aSN1TaggedObject.getObject());
    }
}
