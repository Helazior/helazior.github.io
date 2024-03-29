package org.spongycastle.asn1.ocsp;

import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERGeneralizedTime;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.DERTaggedObject;
import org.spongycastle.asn1.x509.Extensions;
import org.spongycastle.asn1.x509.X509Extensions;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class SingleResponse extends ASN1Object {
    private CertID certID;
    private CertStatus certStatus;
    private DERGeneralizedTime nextUpdate;
    private Extensions singleExtensions;
    private DERGeneralizedTime thisUpdate;

    public SingleResponse(CertID certID, CertStatus certStatus, DERGeneralizedTime dERGeneralizedTime, DERGeneralizedTime dERGeneralizedTime2, X509Extensions x509Extensions) {
        this(certID, certStatus, dERGeneralizedTime, dERGeneralizedTime2, Extensions.getInstance(x509Extensions));
    }

    public static SingleResponse getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    public CertID getCertID() {
        return this.certID;
    }

    public CertStatus getCertStatus() {
        return this.certStatus;
    }

    public DERGeneralizedTime getNextUpdate() {
        return this.nextUpdate;
    }

    public Extensions getSingleExtensions() {
        return this.singleExtensions;
    }

    public DERGeneralizedTime getThisUpdate() {
        return this.thisUpdate;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        aSN1EncodableVector.add(this.certID);
        aSN1EncodableVector.add(this.certStatus);
        aSN1EncodableVector.add(this.thisUpdate);
        DERGeneralizedTime dERGeneralizedTime = this.nextUpdate;
        if (dERGeneralizedTime != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 0, dERGeneralizedTime));
        }
        Extensions extensions = this.singleExtensions;
        if (extensions != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 1, extensions));
        }
        return new DERSequence(aSN1EncodableVector);
    }

    public SingleResponse(CertID certID, CertStatus certStatus, DERGeneralizedTime dERGeneralizedTime, DERGeneralizedTime dERGeneralizedTime2, Extensions extensions) {
        this.certID = certID;
        this.certStatus = certStatus;
        this.thisUpdate = dERGeneralizedTime;
        this.nextUpdate = dERGeneralizedTime2;
        this.singleExtensions = extensions;
    }

    public static SingleResponse getInstance(Object obj) {
        if (obj instanceof SingleResponse) {
            return (SingleResponse) obj;
        }
        if (obj != null) {
            return new SingleResponse(ASN1Sequence.getInstance(obj));
        }
        return null;
    }

    private SingleResponse(ASN1Sequence aSN1Sequence) {
        this.certID = CertID.getInstance(aSN1Sequence.getObjectAt(0));
        this.certStatus = CertStatus.getInstance(aSN1Sequence.getObjectAt(1));
        this.thisUpdate = (DERGeneralizedTime) aSN1Sequence.getObjectAt(2);
        if (aSN1Sequence.size() > 4) {
            this.nextUpdate = DERGeneralizedTime.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(3), true);
            this.singleExtensions = Extensions.getInstance((ASN1TaggedObject) aSN1Sequence.getObjectAt(4), true);
        } else if (aSN1Sequence.size() > 3) {
            ASN1TaggedObject aSN1TaggedObject = (ASN1TaggedObject) aSN1Sequence.getObjectAt(3);
            if (aSN1TaggedObject.getTagNo() == 0) {
                this.nextUpdate = DERGeneralizedTime.getInstance(aSN1TaggedObject, true);
            } else {
                this.singleExtensions = Extensions.getInstance(aSN1TaggedObject, true);
            }
        }
    }
}
