package org.spongycastle.asn1.cms;

import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Integer;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1OctetString;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1Set;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.BERSequence;
import org.spongycastle.asn1.DERTaggedObject;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class AuthEnvelopedData extends ASN1Object {
    private ASN1Set authAttrs;
    private EncryptedContentInfo authEncryptedContentInfo;
    private ASN1OctetString mac;
    private OriginatorInfo originatorInfo;
    private ASN1Set recipientInfos;
    private ASN1Set unauthAttrs;
    private ASN1Integer version;

    public AuthEnvelopedData(OriginatorInfo originatorInfo, ASN1Set aSN1Set, EncryptedContentInfo encryptedContentInfo, ASN1Set aSN1Set2, ASN1OctetString aSN1OctetString, ASN1Set aSN1Set3) {
        this.version = new ASN1Integer(0);
        this.originatorInfo = originatorInfo;
        this.recipientInfos = aSN1Set;
        this.authEncryptedContentInfo = encryptedContentInfo;
        this.authAttrs = aSN1Set2;
        this.mac = aSN1OctetString;
        this.unauthAttrs = aSN1Set3;
    }

    public static AuthEnvelopedData getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    public ASN1Set getAuthAttrs() {
        return this.authAttrs;
    }

    public EncryptedContentInfo getAuthEncryptedContentInfo() {
        return this.authEncryptedContentInfo;
    }

    public ASN1OctetString getMac() {
        return this.mac;
    }

    public OriginatorInfo getOriginatorInfo() {
        return this.originatorInfo;
    }

    public ASN1Set getRecipientInfos() {
        return this.recipientInfos;
    }

    public ASN1Set getUnauthAttrs() {
        return this.unauthAttrs;
    }

    public ASN1Integer getVersion() {
        return this.version;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.version);
        OriginatorInfo originatorInfo = this.originatorInfo;
        if (originatorInfo != null) {
            aSN1EncodableVector.add(new DERTaggedObject(false, 0, originatorInfo));
        }
        aSN1EncodableVector.add(this.recipientInfos);
        aSN1EncodableVector.add(this.authEncryptedContentInfo);
        ASN1Set aSN1Set = this.authAttrs;
        if (aSN1Set != null) {
            aSN1EncodableVector.add(new DERTaggedObject(false, 1, aSN1Set));
        }
        aSN1EncodableVector.add(this.mac);
        ASN1Set aSN1Set2 = this.unauthAttrs;
        if (aSN1Set2 != null) {
            aSN1EncodableVector.add(new DERTaggedObject(false, 2, aSN1Set2));
        }
        return new BERSequence(aSN1EncodableVector);
    }

    public static AuthEnvelopedData getInstance(Object obj) {
        if (obj != null && !(obj instanceof AuthEnvelopedData)) {
            if (obj instanceof ASN1Sequence) {
                return new AuthEnvelopedData((ASN1Sequence) obj);
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("Invalid AuthEnvelopedData: ")));
        }
        return (AuthEnvelopedData) obj;
    }

    public AuthEnvelopedData(ASN1Sequence aSN1Sequence) {
        this.version = (ASN1Integer) aSN1Sequence.getObjectAt(0).toASN1Primitive();
        ASN1Primitive aSN1Primitive = aSN1Sequence.getObjectAt(1).toASN1Primitive();
        int i = 2;
        if (aSN1Primitive instanceof ASN1TaggedObject) {
            this.originatorInfo = OriginatorInfo.getInstance((ASN1TaggedObject) aSN1Primitive, false);
            aSN1Primitive = aSN1Sequence.getObjectAt(2).toASN1Primitive();
            i = 3;
        }
        this.recipientInfos = ASN1Set.getInstance(aSN1Primitive);
        int i2 = i + 1;
        this.authEncryptedContentInfo = EncryptedContentInfo.getInstance(aSN1Sequence.getObjectAt(i).toASN1Primitive());
        int i3 = i2 + 1;
        ASN1Primitive aSN1Primitive2 = aSN1Sequence.getObjectAt(i2).toASN1Primitive();
        if (aSN1Primitive2 instanceof ASN1TaggedObject) {
            this.authAttrs = ASN1Set.getInstance((ASN1TaggedObject) aSN1Primitive2, false);
            int i4 = i3 + 1;
            ASN1Primitive aSN1Primitive3 = aSN1Sequence.getObjectAt(i3).toASN1Primitive();
            i3 = i4;
            aSN1Primitive2 = aSN1Primitive3;
        }
        this.mac = ASN1OctetString.getInstance(aSN1Primitive2);
        if (aSN1Sequence.size() > i3) {
            this.unauthAttrs = ASN1Set.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(i3).toASN1Primitive(), false);
        }
    }
}
