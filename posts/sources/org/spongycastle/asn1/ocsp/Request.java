package org.spongycastle.asn1.ocsp;

import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.DERTaggedObject;
import org.spongycastle.asn1.x509.Extensions;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class Request extends ASN1Object {
    public CertID reqCert;
    public Extensions singleRequestExtensions;

    public Request(CertID certID, Extensions extensions) {
        this.reqCert = certID;
        this.singleRequestExtensions = extensions;
    }

    public static Request getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    public CertID getReqCert() {
        return this.reqCert;
    }

    public Extensions getSingleRequestExtensions() {
        return this.singleRequestExtensions;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.reqCert);
        Extensions extensions = this.singleRequestExtensions;
        if (extensions != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 0, extensions));
        }
        return new DERSequence(aSN1EncodableVector);
    }

    public static Request getInstance(Object obj) {
        if (obj instanceof Request) {
            return (Request) obj;
        }
        if (obj != null) {
            return new Request(ASN1Sequence.getInstance(obj));
        }
        return null;
    }

    private Request(ASN1Sequence aSN1Sequence) {
        this.reqCert = CertID.getInstance(aSN1Sequence.getObjectAt(0));
        if (aSN1Sequence.size() == 2) {
            this.singleRequestExtensions = Extensions.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(1), true);
        }
    }
}
