package org.spongycastle.asn1.isismtt.x509;

import java.util.Enumeration;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERPrintableString;
import org.spongycastle.asn1.DERSequence;
import org.spongycastle.asn1.DERTaggedObject;
import org.spongycastle.asn1.x500.DirectoryString;
import org.spongycastle.asn1.x509.GeneralName;
import org.spongycastle.asn1.x509.IssuerSerial;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ProcurationSyntax extends ASN1Object {
    private IssuerSerial certRef;
    private String country;
    private GeneralName thirdPerson;
    private DirectoryString typeOfSubstitution;

    private ProcurationSyntax(ASN1Sequence aSN1Sequence) {
        if (aSN1Sequence.size() >= 1 && aSN1Sequence.size() <= 3) {
            Enumeration objects = aSN1Sequence.getObjects();
            while (objects.hasMoreElements()) {
                ASN1TaggedObject aSN1TaggedObject = ASN1TaggedObject.getInstance(objects.nextElement());
                int tagNo = aSN1TaggedObject.getTagNo();
                if (tagNo == 1) {
                    this.country = DERPrintableString.getInstance(aSN1TaggedObject, true).getString();
                } else if (tagNo == 2) {
                    this.typeOfSubstitution = DirectoryString.getInstance(aSN1TaggedObject, true);
                } else if (tagNo == 3) {
                    ASN1Primitive object = aSN1TaggedObject.getObject();
                    if (object instanceof ASN1TaggedObject) {
                        this.thirdPerson = GeneralName.getInstance(object);
                    } else {
                        this.certRef = IssuerSerial.getInstance(object);
                    }
                } else {
                    throw new IllegalArgumentException(outline.m257n(aSN1TaggedObject, outline.m253r("Bad tag number: ")));
                }
            }
            return;
        }
        throw new IllegalArgumentException(outline.m259l(aSN1Sequence, outline.m253r("Bad sequence size: ")));
    }

    public static ProcurationSyntax getInstance(Object obj) {
        if (obj != null && !(obj instanceof ProcurationSyntax)) {
            if (obj instanceof ASN1Sequence) {
                return new ProcurationSyntax((ASN1Sequence) obj);
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("illegal object in getInstance: ")));
        }
        return (ProcurationSyntax) obj;
    }

    public IssuerSerial getCertRef() {
        return this.certRef;
    }

    public String getCountry() {
        return this.country;
    }

    public GeneralName getThirdPerson() {
        return this.thirdPerson;
    }

    public DirectoryString getTypeOfSubstitution() {
        return this.typeOfSubstitution;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        String str = this.country;
        if (str != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 1, new DERPrintableString(str, true)));
        }
        DirectoryString directoryString = this.typeOfSubstitution;
        if (directoryString != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 2, directoryString));
        }
        GeneralName generalName = this.thirdPerson;
        if (generalName != null) {
            aSN1EncodableVector.add(new DERTaggedObject(true, 3, generalName));
        } else {
            aSN1EncodableVector.add(new DERTaggedObject(true, 3, this.certRef));
        }
        return new DERSequence(aSN1EncodableVector);
    }

    public ProcurationSyntax(String str, DirectoryString directoryString, IssuerSerial issuerSerial) {
        this.country = str;
        this.typeOfSubstitution = directoryString;
        this.thirdPerson = null;
        this.certRef = issuerSerial;
    }

    public ProcurationSyntax(String str, DirectoryString directoryString, GeneralName generalName) {
        this.country = str;
        this.typeOfSubstitution = directoryString;
        this.thirdPerson = generalName;
        this.certRef = null;
    }
}
