package org.spongycastle.asn1.x509;

import java.math.BigInteger;
import java.util.Hashtable;
import org.spongycastle.asn1.ASN1Enumerated;
import org.spongycastle.asn1.ASN1Object;
import org.spongycastle.asn1.ASN1Primitive;
import org.spongycastle.asn1.DEREnumerated;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CRLReason extends ASN1Object {
    public static final int AA_COMPROMISE = 10;
    public static final int AFFILIATION_CHANGED = 3;
    public static final int CA_COMPROMISE = 2;
    public static final int CERTIFICATE_HOLD = 6;
    public static final int CESSATION_OF_OPERATION = 5;
    public static final int KEY_COMPROMISE = 1;
    public static final int PRIVILEGE_WITHDRAWN = 9;
    public static final int REMOVE_FROM_CRL = 8;
    public static final int SUPERSEDED = 4;
    public static final int UNSPECIFIED = 0;
    public static final int aACompromise = 10;
    public static final int affiliationChanged = 3;
    public static final int cACompromise = 2;
    public static final int certificateHold = 6;
    public static final int cessationOfOperation = 5;
    public static final int keyCompromise = 1;
    public static final int privilegeWithdrawn = 9;
    public static final int removeFromCRL = 8;
    public static final int superseded = 4;
    public static final int unspecified = 0;
    private ASN1Enumerated value;
    private static final String[] reasonString = {"unspecified", "keyCompromise", "cACompromise", "affiliationChanged", "superseded", "cessationOfOperation", "certificateHold", "unknown", "removeFromCRL", "privilegeWithdrawn", "aACompromise"};
    private static final Hashtable table = new Hashtable();

    private CRLReason(int i) {
        this.value = new ASN1Enumerated(i);
    }

    public static CRLReason getInstance(Object obj) {
        if (obj instanceof CRLReason) {
            return (CRLReason) obj;
        }
        if (obj != null) {
            return lookup(DEREnumerated.getInstance(obj).getValue().intValue());
        }
        return null;
    }

    public static CRLReason lookup(int i) {
        Integer num = new Integer(i);
        Hashtable hashtable = table;
        if (!hashtable.containsKey(num)) {
            hashtable.put(num, new CRLReason(i));
        }
        return (CRLReason) hashtable.get(num);
    }

    public BigInteger getValue() {
        return this.value.getValue();
    }

    @Override // org.spongycastle.asn1.ASN1Object, org.spongycastle.asn1.ASN1Encodable
    public ASN1Primitive toASN1Primitive() {
        return this.value;
    }

    public String toString() {
        int intValue = getValue().intValue();
        return outline.m266e("CRLReason: ", (intValue < 0 || intValue > 10) ? "invalid" : reasonString[intValue]);
    }
}
