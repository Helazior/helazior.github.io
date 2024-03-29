package org.spongycastle.jce.provider;

import java.io.IOException;
import java.math.BigInteger;
import java.security.cert.CRLException;
import java.security.cert.X509CRLEntry;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import javax.security.auth.x500.X500Principal;
import org.spongycastle.asn1.ASN1Encoding;
import org.spongycastle.asn1.ASN1InputStream;
import org.spongycastle.asn1.ASN1ObjectIdentifier;
import org.spongycastle.asn1.DEREnumerated;
import org.spongycastle.asn1.util.ASN1Dump;
import org.spongycastle.asn1.x500.X500Name;
import org.spongycastle.asn1.x509.CRLReason;
import org.spongycastle.asn1.x509.Extension;
import org.spongycastle.asn1.x509.Extensions;
import org.spongycastle.asn1.x509.GeneralName;
import org.spongycastle.asn1.x509.GeneralNames;
import org.spongycastle.asn1.x509.TBSCertList;
import org.spongycastle.asn1.x509.X509Extension;
import org.spongycastle.x509.extension.X509ExtensionUtil;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class X509CRLEntryObject extends X509CRLEntry {

    /* renamed from: c */
    private TBSCertList.CRLEntry f6112c;
    private X500Name certificateIssuer;
    private int hashValue;
    private boolean isHashValueSet;

    public X509CRLEntryObject(TBSCertList.CRLEntry cRLEntry) {
        this.f6112c = cRLEntry;
        this.certificateIssuer = null;
    }

    private Set getExtensionOIDs(boolean z) {
        Extensions extensions = this.f6112c.getExtensions();
        if (extensions != null) {
            HashSet hashSet = new HashSet();
            Enumeration oids = extensions.oids();
            while (oids.hasMoreElements()) {
                ASN1ObjectIdentifier aSN1ObjectIdentifier = (ASN1ObjectIdentifier) oids.nextElement();
                if (z == extensions.getExtension(aSN1ObjectIdentifier).isCritical()) {
                    hashSet.add(aSN1ObjectIdentifier.getId());
                }
            }
            return hashSet;
        }
        return null;
    }

    private X500Name loadCertificateIssuer(boolean z, X500Name x500Name) {
        if (z) {
            byte[] extensionValue = getExtensionValue(X509Extension.certificateIssuer.getId());
            if (extensionValue == null) {
                return x500Name;
            }
            try {
                GeneralName[] names = GeneralNames.getInstance(X509ExtensionUtil.fromExtensionValue(extensionValue)).getNames();
                for (int i = 0; i < names.length; i++) {
                    if (names[i].getTagNo() == 4) {
                        return X500Name.getInstance(names[i].getName());
                    }
                }
            } catch (IOException unused) {
            }
            return null;
        }
        return null;
    }

    @Override // java.security.cert.X509CRLEntry
    public X500Principal getCertificateIssuer() {
        if (this.certificateIssuer == null) {
            return null;
        }
        try {
            return new X500Principal(this.certificateIssuer.getEncoded());
        } catch (IOException unused) {
            return null;
        }
    }

    @Override // java.security.cert.X509Extension
    public Set getCriticalExtensionOIDs() {
        return getExtensionOIDs(true);
    }

    @Override // java.security.cert.X509CRLEntry
    public byte[] getEncoded() {
        try {
            return this.f6112c.getEncoded(ASN1Encoding.DER);
        } catch (IOException e) {
            throw new CRLException(e.toString());
        }
    }

    @Override // java.security.cert.X509Extension
    public byte[] getExtensionValue(String str) {
        Extension extension;
        Extensions extensions = this.f6112c.getExtensions();
        if (extensions == null || (extension = extensions.getExtension(new ASN1ObjectIdentifier(str))) == null) {
            return null;
        }
        try {
            return extension.getExtnValue().getEncoded();
        } catch (Exception e) {
            throw new RuntimeException(outline.m275F(e, outline.m253r("error encoding ")));
        }
    }

    @Override // java.security.cert.X509Extension
    public Set getNonCriticalExtensionOIDs() {
        return getExtensionOIDs(false);
    }

    @Override // java.security.cert.X509CRLEntry
    public Date getRevocationDate() {
        return this.f6112c.getRevocationDate().getDate();
    }

    @Override // java.security.cert.X509CRLEntry
    public BigInteger getSerialNumber() {
        return this.f6112c.getUserCertificate().getValue();
    }

    @Override // java.security.cert.X509CRLEntry
    public boolean hasExtensions() {
        return this.f6112c.getExtensions() != null;
    }

    @Override // java.security.cert.X509Extension
    public boolean hasUnsupportedCriticalExtension() {
        Set criticalExtensionOIDs = getCriticalExtensionOIDs();
        return (criticalExtensionOIDs == null || criticalExtensionOIDs.isEmpty()) ? false : true;
    }

    @Override // java.security.cert.X509CRLEntry
    public int hashCode() {
        if (!this.isHashValueSet) {
            this.hashValue = super.hashCode();
            this.isHashValueSet = true;
        }
        return this.hashValue;
    }

    @Override // java.security.cert.X509CRLEntry
    public String toString() {
        StringBuffer stringBuffer = new StringBuffer();
        String property = System.getProperty("line.separator");
        stringBuffer.append("      userCertificate: ");
        stringBuffer.append(getSerialNumber());
        stringBuffer.append(property);
        stringBuffer.append("       revocationDate: ");
        stringBuffer.append(getRevocationDate());
        stringBuffer.append(property);
        stringBuffer.append("       certificateIssuer: ");
        stringBuffer.append(getCertificateIssuer());
        stringBuffer.append(property);
        Extensions extensions = this.f6112c.getExtensions();
        if (extensions != null) {
            Enumeration oids = extensions.oids();
            if (oids.hasMoreElements()) {
                stringBuffer.append("   crlEntryExtensions:");
                stringBuffer.append(property);
                while (oids.hasMoreElements()) {
                    ASN1ObjectIdentifier aSN1ObjectIdentifier = (ASN1ObjectIdentifier) oids.nextElement();
                    Extension extension = extensions.getExtension(aSN1ObjectIdentifier);
                    if (extension.getExtnValue() != null) {
                        ASN1InputStream aSN1InputStream = new ASN1InputStream(extension.getExtnValue().getOctets());
                        stringBuffer.append("                       critical(");
                        stringBuffer.append(extension.isCritical());
                        stringBuffer.append(") ");
                        try {
                            if (aSN1ObjectIdentifier.equals(X509Extension.reasonCode)) {
                                stringBuffer.append(CRLReason.getInstance(DEREnumerated.getInstance(aSN1InputStream.readObject())));
                                stringBuffer.append(property);
                            } else if (aSN1ObjectIdentifier.equals(X509Extension.certificateIssuer)) {
                                stringBuffer.append("Certificate issuer: ");
                                stringBuffer.append(GeneralNames.getInstance(aSN1InputStream.readObject()));
                                stringBuffer.append(property);
                            } else {
                                stringBuffer.append(aSN1ObjectIdentifier.getId());
                                stringBuffer.append(" value = ");
                                stringBuffer.append(ASN1Dump.dumpAsString(aSN1InputStream.readObject()));
                                stringBuffer.append(property);
                            }
                        } catch (Exception unused) {
                            stringBuffer.append(aSN1ObjectIdentifier.getId());
                            stringBuffer.append(" value = ");
                            stringBuffer.append("*****");
                            stringBuffer.append(property);
                        }
                    } else {
                        stringBuffer.append(property);
                    }
                }
            }
        }
        return stringBuffer.toString();
    }

    public X509CRLEntryObject(TBSCertList.CRLEntry cRLEntry, boolean z, X500Name x500Name) {
        this.f6112c = cRLEntry;
        this.certificateIssuer = loadCertificateIssuer(z, x500Name);
    }
}
