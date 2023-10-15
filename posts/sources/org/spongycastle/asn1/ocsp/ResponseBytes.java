package org.spongycastle.asn1.ocsp;

import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.ASN1OctetString;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERSequence;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ResponseBytes extends ASN1Object {
    public ASN1OctetString response;
    public ASN1ObjectIdentifier responseType;

    public ResponseBytes(ASN1ObjectIdentifier aSN1ObjectIdentifier, ASN1OctetString aSN1OctetString) {
        this.responseType = aSN1ObjectIdentifier;
        this.response = aSN1OctetString;
    }

    public static ResponseBytes getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    public ASN1OctetString getResponse() {
        return this.response;
    }

    public ASN1ObjectIdentifier getResponseType() {
        return this.responseType;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.responseType);
        aSN1EncodableVector.add(this.response);
        return new DERSequence(aSN1EncodableVector);
    }

    public static ResponseBytes getInstance(Object obj) {
        if (obj != null && !(obj instanceof ResponseBytes)) {
            if (obj instanceof ASN1Sequence) {
                return new ResponseBytes((ASN1Sequence) obj);
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("unknown object in factory: ")));
        }
        return (ResponseBytes) obj;
    }

    public ResponseBytes(ASN1Sequence aSN1Sequence) {
        this.responseType = (ASN1ObjectIdentifier) aSN1Sequence.getObjectAt(0);
        this.response = (ASN1OctetString) aSN1Sequence.getObjectAt(1);
    }
}