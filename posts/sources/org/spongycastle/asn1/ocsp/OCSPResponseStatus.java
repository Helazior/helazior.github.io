package org.spongycastle.asn1.ocsp;

import java.math.BigInteger;
import org.spongycastle.asn1.ASN1Enumerated;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.DEREnumerated;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class OCSPResponseStatus extends ASN1Object {
    public static final int INTERNAL_ERROR = 2;
    public static final int MALFORMED_REQUEST = 1;
    public static final int SIG_REQUIRED = 5;
    public static final int SUCCESSFUL = 0;
    public static final int TRY_LATER = 3;
    public static final int UNAUTHORIZED = 6;
    private ASN1Enumerated value;

    public OCSPResponseStatus(int i) {
        this(new ASN1Enumerated(i));
    }

    public static OCSPResponseStatus getInstance(Object obj) {
        if (obj instanceof OCSPResponseStatus) {
            return (OCSPResponseStatus) obj;
        }
        if (obj != null) {
            return new OCSPResponseStatus(DEREnumerated.getInstance(obj));
        }
        return null;
    }

    public BigInteger getValue() {
        return this.value.getValue();
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        return this.value;
    }

    private OCSPResponseStatus(ASN1Enumerated aSN1Enumerated) {
        this.value = aSN1Enumerated;
    }
}
