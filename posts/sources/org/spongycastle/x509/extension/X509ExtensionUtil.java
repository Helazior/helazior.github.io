package org.spongycastle.x509.extension;

import java.io.IOException;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import org.spongycastle.asn1.ASN1OctetString;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.ASN1Sequence;
import org.spongycastle.asn1.ASN1String;
import org.spongycastle.asn1.DERObjectIdentifier;
import org.spongycastle.asn1.x500.X500Name;
import org.spongycastle.asn1.x509.GeneralName;
import org.spongycastle.asn1.x509.X509Extension;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class X509ExtensionUtil {
    public static ASN1Primitive fromExtensionValue(byte[] bArr) {
        return ASN1Primitive.fromByteArray(((ASN1OctetString) ASN1Primitive.fromByteArray(bArr)).getOctets());
    }

    private static Collection getAlternativeNames(byte[] bArr) {
        if (bArr == null) {
            return Collections.EMPTY_LIST;
        }
        try {
            ArrayList arrayList = new ArrayList();
            Enumeration objects = ASN1Sequence.getInstance(fromExtensionValue(bArr)).getObjects();
            while (objects.hasMoreElements()) {
                GeneralName generalName = GeneralName.getInstance(objects.nextElement());
                ArrayList arrayList2 = new ArrayList();
                arrayList2.add(new Integer(generalName.getTagNo()));
                switch (generalName.getTagNo()) {
                    case 0:
                    case 3:
                    case 5:
                        arrayList2.add(generalName.getName().toASN1Primitive());
                        break;
                    case 1:
                    case 2:
                    case 6:
                        arrayList2.add(((ASN1String) generalName.getName()).getString());
                        break;
                    case 4:
                        arrayList2.add(X500Name.getInstance(generalName.getName()).toString());
                        break;
                    case 7:
                        arrayList2.add(ASN1OctetString.getInstance(generalName.getName()).getOctets());
                        break;
                    case 8:
                        arrayList2.add(DERObjectIdentifier.getInstance(generalName.getName()).getId());
                        break;
                    default:
                        throw new IOException("Bad tag number: " + generalName.getTagNo());
                }
                arrayList.add(arrayList2);
            }
            return Collections.unmodifiableCollection(arrayList);
        } catch (Exception e) {
            throw new CertificateParsingException(e.getMessage());
        }
    }

    public static Collection getIssuerAlternativeNames(X509Certificate x509Certificate) {
        return getAlternativeNames(x509Certificate.getExtensionValue(X509Extension.issuerAlternativeName.getId()));
    }

    public static Collection getSubjectAlternativeNames(X509Certificate x509Certificate) {
        return getAlternativeNames(x509Certificate.getExtensionValue(X509Extension.subjectAlternativeName.getId()));
    }
}
