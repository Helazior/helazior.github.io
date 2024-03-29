package org.spongycastle.asn1.iana;

import org.spongycastle.asn1.ASN1ObjectIdentifier;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public interface IANAObjectIdentifiers {
    public static final ASN1ObjectIdentifier hmacMD5;
    public static final ASN1ObjectIdentifier hmacRIPEMD160;
    public static final ASN1ObjectIdentifier hmacSHA1;
    public static final ASN1ObjectIdentifier hmacTIGER;
    public static final ASN1ObjectIdentifier isakmpOakley;

    static {
        ASN1ObjectIdentifier aSN1ObjectIdentifier = new ASN1ObjectIdentifier("1.3.6.1.5.5.8.1");
        isakmpOakley = aSN1ObjectIdentifier;
        hmacMD5 = new ASN1ObjectIdentifier(outline.m260k(aSN1ObjectIdentifier, ".1"));
        hmacSHA1 = new ASN1ObjectIdentifier(outline.m260k(aSN1ObjectIdentifier, ".2"));
        hmacTIGER = new ASN1ObjectIdentifier(outline.m260k(aSN1ObjectIdentifier, ".3"));
        hmacRIPEMD160 = new ASN1ObjectIdentifier(outline.m260k(aSN1ObjectIdentifier, ".4"));
    }
}
