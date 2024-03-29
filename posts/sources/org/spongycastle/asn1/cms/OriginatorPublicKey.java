package org.spongycastle.asn1.cms;

import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERBitString;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.x509.AlgorithmIdentifier;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class OriginatorPublicKey extends ASN1Object {
    private AlgorithmIdentifier algorithm;
    private DERBitString publicKey;

    public OriginatorPublicKey(AlgorithmIdentifier algorithmIdentifier, byte[] bArr) {
        this.algorithm = algorithmIdentifier;
        this.publicKey = new DERBitString(bArr);
    }

    public static OriginatorPublicKey getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    public AlgorithmIdentifier getAlgorithm() {
        return this.algorithm;
    }

    public DERBitString getPublicKey() {
        return this.publicKey;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.algorithm);
        aSN1EncodableVector.add(this.publicKey);
        return new DERSequence(aSN1EncodableVector);
    }

    public static OriginatorPublicKey getInstance(Object obj) {
        if (obj != null && !(obj instanceof OriginatorPublicKey)) {
            if (obj instanceof ASN1Sequence) {
                return new OriginatorPublicKey((ASN1Sequence) obj);
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("Invalid OriginatorPublicKey: ")));
        }
        return (OriginatorPublicKey) obj;
    }

    public OriginatorPublicKey(ASN1Sequence aSN1Sequence) {
        this.algorithm = AlgorithmIdentifier.getInstance(aSN1Sequence.getObjectAt(0));
        this.publicKey = (DERBitString) aSN1Sequence.getObjectAt(1);
    }
}
