package org.spongycastle.asn1.smime;

import java.util.Enumeration;
import java.util.Vector;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.cms.Attribute;
import org.spongycastle.asn1.pkcs.PKCSObjectIdentifiers;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class SMIMECapabilities extends ASN1Object {
    private ASN1Sequence capabilities;
    public static final ASN1ObjectIdentifier preferSignedData = PKCSObjectIdentifiers.preferSignedData;
    public static final ASN1ObjectIdentifier canNotDecryptAny = PKCSObjectIdentifiers.canNotDecryptAny;
    public static final ASN1ObjectIdentifier sMIMECapabilitesVersions = PKCSObjectIdentifiers.sMIMECapabilitiesVersions;
    public static final ASN1ObjectIdentifier dES_CBC = new ASN1ObjectIdentifier("1.3.14.3.2.7");
    public static final ASN1ObjectIdentifier dES_EDE3_CBC = PKCSObjectIdentifiers.des_EDE3_CBC;
    public static final ASN1ObjectIdentifier rC2_CBC = PKCSObjectIdentifiers.RC2_CBC;

    public SMIMECapabilities(ASN1Sequence aSN1Sequence) {
        this.capabilities = aSN1Sequence;
    }

    public static SMIMECapabilities getInstance(Object obj) {
        if (obj != null && !(obj instanceof SMIMECapabilities)) {
            if (obj instanceof ASN1Sequence) {
                return new SMIMECapabilities((ASN1Sequence) obj);
            }
            if (obj instanceof Attribute) {
                return new SMIMECapabilities((ASN1Sequence) ((Attribute) obj).getAttrValues().getObjectAt(0));
            }
            throw new IllegalArgumentException(outline.m274G(obj, outline.m253r("unknown object in factory: ")));
        }
        return (SMIMECapabilities) obj;
    }

    public Vector getCapabilities(ASN1ObjectIdentifier aSN1ObjectIdentifier) {
        Enumeration objects = this.capabilities.getObjects();
        Vector vector = new Vector();
        if (aSN1ObjectIdentifier == null) {
            while (objects.hasMoreElements()) {
                vector.addElement(SMIMECapability.getInstance(objects.nextElement()));
            }
        } else {
            while (objects.hasMoreElements()) {
                SMIMECapability sMIMECapability = SMIMECapability.getInstance(objects.nextElement());
                if (aSN1ObjectIdentifier.equals(sMIMECapability.getCapabilityID())) {
                    vector.addElement(sMIMECapability);
                }
            }
        }
        return vector;
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        return this.capabilities;
    }
}
