package org.spongycastle.asn1;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class DERFactory {
    public static final ASN1Sequence EMPTY_SEQUENCE = new DERSequence();
    public static final ASN1Set EMPTY_SET = new DERSet();

    public static ASN1Sequence createSequence(ASN1EncodableVector aSN1EncodableVector) {
        return aSN1EncodableVector.size() < 1 ? EMPTY_SEQUENCE : new DLSequence(aSN1EncodableVector);
    }

    public static ASN1Set createSet(ASN1EncodableVector aSN1EncodableVector) {
        return aSN1EncodableVector.size() < 1 ? EMPTY_SET : new DLSet(aSN1EncodableVector);
    }
}
