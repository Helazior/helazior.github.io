package org.spongycastle.asn1.ocsp;

import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Integer;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERInteger;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.DERTaggedObject;
import org.spongycastle.asn1.x509.Extensions;
import org.spongycastle.asn1.x509.GeneralName;
import org.spongycastle.asn1.x509.X509Extensions;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class TBSRequest extends ASN1Object {

    /* renamed from: V1 */
    private static final ASN1Integer f5667V1 = new ASN1Integer(0);
    public Extensions requestExtensions;
    public ASN1Sequence requestList;
    public GeneralName requestorName;
    public ASN1Integer version;
    public boolean versionSet;

    public TBSRequest(GeneralName generalName, ASN1Sequence aSN1Sequence, X509Extensions x509Extensions) {
        this.version = f5667V1;
        this.requestorName = generalName;
        this.requestList = aSN1Sequence;
        this.requestExtensions = Extensions.getInstance(x509Extensions);
    }

    public static TBSRequest getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    public Extensions getRequestExtensions() {
        return this.requestExtensions;
    }

    public ASN1Sequence getRequestList() {
        return this.requestList;
    }

    public GeneralName getRequestorName() {
        return this.requestorName;
    }

    public ASN1Integer getVersion() {
        return this.version;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        if (!this.version.equals(f5667V1) || this.versionSet) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 0, this.version));
        }
        GeneralName generalName = this.requestorName;
        if (generalName != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 1, generalName));
        }
        aSN1EncodableVector.add(this.requestList);
        Extensions extensions = this.requestExtensions;
        if (extensions != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 2, extensions));
        }
        return new DERSequence(aSN1EncodableVector);
    }

    public static TBSRequest getInstance(Object obj) {
        if (obj instanceof TBSRequest) {
            return (TBSRequest) obj;
        }
        if (obj != null) {
            return new TBSRequest(ASN1Sequence.getInstance(obj));
        }
        return null;
    }

    public TBSRequest(GeneralName generalName, ASN1Sequence aSN1Sequence, Extensions extensions) {
        this.version = f5667V1;
        this.requestorName = generalName;
        this.requestList = aSN1Sequence;
        this.requestExtensions = extensions;
    }

    private TBSRequest(ASN1Sequence aSN1Sequence) {
        int i = 0;
        if (aSN1Sequence.getObjectAt(0) instanceof ASN1TaggedObject) {
            if (((ASN1TaggedObject) aSN1Sequence.getObjectAt(0)).getTagNo() == 0) {
                this.versionSet = true;
                this.version = DERInteger.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(0), true);
                i = 1;
            } else {
                this.version = f5667V1;
            }
        } else {
            this.version = f5667V1;
        }
        if (aSN1Sequence.getObjectAt(i) instanceof ASN1TaggedObject) {
            this.requestorName = GeneralName.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(i), true);
            i++;
        }
        int i2 = i + 1;
        this.requestList = (ASN1Sequence) aSN1Sequence.getObjectAt(i);
        if (aSN1Sequence.size() == i2 + 1) {
            this.requestExtensions = Extensions.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(i2), true);
        }
    }
}
