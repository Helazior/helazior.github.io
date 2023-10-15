package org.spongycastle.asn1.x509;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Vector;
import org.spongycastle.asn1.ASN1EncodableVector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.ASN1OctetString;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1TaggedObject;
import org.spongycastle.asn1.DERBoolean;
import org.spongycastle.asn1.DERObjectIdentifier;
import org.spongycastle.asn1.DERSequence;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class X509Extensions extends ASN1Object {
    private Hashtable extensions;
    private Vector ordering;
    public static final ASN1ObjectIdentifier SubjectDirectoryAttributes = new ASN1ObjectIdentifier("2.5.29.9");
    public static final ASN1ObjectIdentifier SubjectKeyIdentifier = new ASN1ObjectIdentifier("2.5.29.14");
    public static final ASN1ObjectIdentifier KeyUsage = new ASN1ObjectIdentifier("2.5.29.15");
    public static final ASN1ObjectIdentifier PrivateKeyUsagePeriod = new ASN1ObjectIdentifier("2.5.29.16");
    public static final ASN1ObjectIdentifier SubjectAlternativeName = new ASN1ObjectIdentifier("2.5.29.17");
    public static final ASN1ObjectIdentifier IssuerAlternativeName = new ASN1ObjectIdentifier("2.5.29.18");
    public static final ASN1ObjectIdentifier BasicConstraints = new ASN1ObjectIdentifier("2.5.29.19");
    public static final ASN1ObjectIdentifier CRLNumber = new ASN1ObjectIdentifier("2.5.29.20");
    public static final ASN1ObjectIdentifier ReasonCode = new ASN1ObjectIdentifier("2.5.29.21");
    public static final ASN1ObjectIdentifier InstructionCode = new ASN1ObjectIdentifier("2.5.29.23");
    public static final ASN1ObjectIdentifier InvalidityDate = new ASN1ObjectIdentifier("2.5.29.24");
    public static final ASN1ObjectIdentifier DeltaCRLIndicator = new ASN1ObjectIdentifier("2.5.29.27");
    public static final ASN1ObjectIdentifier IssuingDistributionPoint = new ASN1ObjectIdentifier("2.5.29.28");
    public static final ASN1ObjectIdentifier CertificateIssuer = new ASN1ObjectIdentifier("2.5.29.29");
    public static final ASN1ObjectIdentifier NameConstraints = new ASN1ObjectIdentifier("2.5.29.30");
    public static final ASN1ObjectIdentifier CRLDistributionPoints = new ASN1ObjectIdentifier("2.5.29.31");
    public static final ASN1ObjectIdentifier CertificatePolicies = new ASN1ObjectIdentifier("2.5.29.32");
    public static final ASN1ObjectIdentifier PolicyMappings = new ASN1ObjectIdentifier("2.5.29.33");
    public static final ASN1ObjectIdentifier AuthorityKeyIdentifier = new ASN1ObjectIdentifier("2.5.29.35");
    public static final ASN1ObjectIdentifier PolicyConstraints = new ASN1ObjectIdentifier("2.5.29.36");
    public static final ASN1ObjectIdentifier ExtendedKeyUsage = new ASN1ObjectIdentifier("2.5.29.37");
    public static final ASN1ObjectIdentifier FreshestCRL = new ASN1ObjectIdentifier("2.5.29.46");
    public static final ASN1ObjectIdentifier InhibitAnyPolicy = new ASN1ObjectIdentifier("2.5.29.54");
    public static final ASN1ObjectIdentifier AuthorityInfoAccess = new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.1");
    public static final ASN1ObjectIdentifier SubjectInfoAccess = new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.11");
    public static final ASN1ObjectIdentifier LogoType = new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.12");
    public static final ASN1ObjectIdentifier BiometricInfo = new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.2");
    public static final ASN1ObjectIdentifier QCStatements = new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.3");
    public static final ASN1ObjectIdentifier AuditIdentity = new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.4");
    public static final ASN1ObjectIdentifier NoRevAvail = new ASN1ObjectIdentifier("2.5.29.56");
    public static final ASN1ObjectIdentifier TargetInformation = new ASN1ObjectIdentifier("2.5.29.55");

    public X509Extensions(ASN1Sequence aSN1Sequence) {
        this.extensions = new Hashtable();
        this.ordering = new Vector();
        Enumeration objects = aSN1Sequence.getObjects();
        while (objects.hasMoreElements()) {
            ASN1Sequence aSN1Sequence2 = ASN1Sequence.getInstance(objects.nextElement());
            if (aSN1Sequence2.size() == 3) {
                this.extensions.put(aSN1Sequence2.getObjectAt(0), new X509Extension(DERBoolean.getInstance(aSN1Sequence2.getObjectAt(1)), ASN1OctetString.getInstance(aSN1Sequence2.getObjectAt(2))));
            } else if (aSN1Sequence2.size() == 2) {
                this.extensions.put(aSN1Sequence2.getObjectAt(0), new X509Extension(false, ASN1OctetString.getInstance(aSN1Sequence2.getObjectAt(1))));
            } else {
                throw new IllegalArgumentException(outline.m259l(aSN1Sequence2, outline.m253r("Bad sequence size: ")));
            }
            this.ordering.addElement(aSN1Sequence2.getObjectAt(0));
        }
    }

    public static X509Extensions getInstance(ASN1TaggedObject aSN1TaggedObject, boolean z) {
        return getInstance(ASN1Sequence.getInstance(aSN1TaggedObject, z));
    }

    private ASN1ObjectIdentifier[] toOidArray(Vector vector) {
        int size = vector.size();
        ASN1ObjectIdentifier[] aSN1ObjectIdentifierArr = new ASN1ObjectIdentifier[size];
        for (int i = 0; i != size; i++) {
            aSN1ObjectIdentifierArr[i] = (ASN1ObjectIdentifier) vector.elementAt(i);
        }
        return aSN1ObjectIdentifierArr;
    }

    public boolean equivalent(X509Extensions x509Extensions) {
        if (this.extensions.size() != x509Extensions.extensions.size()) {
            return false;
        }
        Enumeration keys = this.extensions.keys();
        while (keys.hasMoreElements()) {
            Object nextElement = keys.nextElement();
            if (!this.extensions.get(nextElement).equals(x509Extensions.extensions.get(nextElement))) {
                return false;
            }
        }
        return true;
    }

    public ASN1ObjectIdentifier[] getCriticalExtensionOIDs() {
        return getExtensionOIDs(true);
    }

    public X509Extension getExtension(DERObjectIdentifier dERObjectIdentifier) {
        return (X509Extension) this.extensions.get(dERObjectIdentifier);
    }

    public ASN1ObjectIdentifier[] getExtensionOIDs() {
        return toOidArray(this.ordering);
    }

    public ASN1ObjectIdentifier[] getNonCriticalExtensionOIDs() {
        return getExtensionOIDs(false);
    }

    public Enumeration oids() {
        return this.ordering.elements();
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        ASN1EncodableVector aSN1EncodableVector = new ASN1EncodableVector();
        Enumeration elements = this.ordering.elements();
        while (elements.hasMoreElements()) {
            ASN1ObjectIdentifier aSN1ObjectIdentifier = (ASN1ObjectIdentifier) elements.nextElement();
            X509Extension x509Extension = (X509Extension) this.extensions.get(aSN1ObjectIdentifier);
            ASN1EncodableVector aSN1EncodableVector2 = new ASN1EncodableVector();
            aSN1EncodableVector2.add(aSN1ObjectIdentifier);
            if (x509Extension.isCritical()) {
                aSN1EncodableVector2.add(new DERBoolean(true));
            }
            aSN1EncodableVector2.add(x509Extension.getValue());
            aSN1EncodableVector.add(new DERSequence(aSN1EncodableVector2));
        }
        return new DERSequence(aSN1EncodableVector);
    }

    private ASN1ObjectIdentifier[] getExtensionOIDs(boolean z) {
        Vector vector = new Vector();
        for (int i = 0; i != this.ordering.size(); i++) {
            Object elementAt = this.ordering.elementAt(i);
            if (((X509Extension) this.extensions.get(elementAt)).isCritical() == z) {
                vector.addElement(elementAt);
            }
        }
        return toOidArray(vector);
    }

    public static X509Extensions getInstance(Object obj) {
        if (obj != null && !(obj instanceof X509Extensions)) {
            if (obj instanceof ASN1Sequence) {
                return new X509Extensions((ASN1Sequence) obj);
            }
            if (obj instanceof Extensions) {
                return new X509Extensions((ASN1Sequence) ((Extensions) obj).toASN1Primitive());
            }
            if (obj instanceof ASN1TaggedObject) {
                return getInstance(((ASN1TaggedObject) obj).getObject());
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("illegal object in getInstance: ")));
        }
        return (X509Extensions) obj;
    }

    public X509Extension getExtension(ASN1ObjectIdentifier aSN1ObjectIdentifier) {
        return (X509Extension) this.extensions.get(aSN1ObjectIdentifier);
    }

    public X509Extensions(Hashtable hashtable) {
        this((Vector) null, hashtable);
    }

    public X509Extensions(Vector vector, Hashtable hashtable) {
        Enumeration elements;
        this.extensions = new Hashtable();
        this.ordering = new Vector();
        if (vector == null) {
            elements = hashtable.keys();
        } else {
            elements = vector.elements();
        }
        while (elements.hasMoreElements()) {
            this.ordering.addElement(DERObjectIdentifier.getInstance(elements.nextElement()));
        }
        Enumeration elements2 = this.ordering.elements();
        while (elements2.hasMoreElements()) {
            ASN1ObjectIdentifier dERObjectIdentifier = DERObjectIdentifier.getInstance(elements2.nextElement());
            this.extensions.put(dERObjectIdentifier, (X509Extension) hashtable.get(dERObjectIdentifier));
        }
    }

    public X509Extensions(Vector vector, Vector vector2) {
        this.extensions = new Hashtable();
        this.ordering = new Vector();
        Enumeration elements = vector.elements();
        while (elements.hasMoreElements()) {
            this.ordering.addElement(elements.nextElement());
        }
        int i = 0;
        Enumeration elements2 = this.ordering.elements();
        while (elements2.hasMoreElements()) {
            this.extensions.put((ASN1ObjectIdentifier) elements2.nextElement(), (X509Extension) vector2.elementAt(i));
            i++;
        }
    }
}
