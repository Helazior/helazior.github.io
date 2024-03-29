package org.spongycastle.math.p017ec;

import java.math.BigInteger;
import org.spongycastle.math.p017ec.ECCurve;
import org.spongycastle.math.p017ec.ECPoint;

/* renamed from: org.spongycastle.math.ec.WTauNafMultiplier */
/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class WTauNafMultiplier implements ECMultiplier {
    private static ECPoint.F2m multiplyFromWTnaf(ECPoint.F2m f2m, byte[] bArr, PreCompInfo preCompInfo) {
        ECPoint.F2m[] preComp;
        byte byteValue = ((ECCurve.F2m) f2m.getCurve()).getA().toBigInteger().byteValue();
        if (preCompInfo != null && (preCompInfo instanceof WTauNafPreCompInfo)) {
            preComp = ((WTauNafPreCompInfo) preCompInfo).getPreComp();
        } else {
            preComp = Tnaf.getPreComp(f2m, byteValue);
            f2m.setPreCompInfo(new WTauNafPreCompInfo(preComp));
        }
        ECPoint.F2m f2m2 = (ECPoint.F2m) f2m.getCurve().getInfinity();
        for (int length = bArr.length - 1; length >= 0; length--) {
            f2m2 = Tnaf.tau(f2m2);
            if (bArr[length] != 0) {
                if (bArr[length] > 0) {
                    f2m2 = f2m2.addSimple(preComp[bArr[length]]);
                } else {
                    f2m2 = f2m2.subtractSimple(preComp[-bArr[length]]);
                }
            }
        }
        return f2m2;
    }

    private ECPoint.F2m multiplyWTnaf(ECPoint.F2m f2m, ZTauElement zTauElement, PreCompInfo preCompInfo, byte b, byte b2) {
        ZTauElement[] zTauElementArr;
        if (b == 0) {
            zTauElementArr = Tnaf.alpha0;
        } else {
            zTauElementArr = Tnaf.alpha1;
        }
        BigInteger tw = Tnaf.getTw(b2, 4);
        return multiplyFromWTnaf(f2m, Tnaf.tauAdicWNaf(b2, zTauElement, (byte) 4, BigInteger.valueOf(16L), tw, zTauElementArr), preCompInfo);
    }

    @Override // org.spongycastle.math.p017ec.ECMultiplier
    public ECPoint multiply(ECPoint eCPoint, BigInteger bigInteger, PreCompInfo preCompInfo) {
        if (eCPoint instanceof ECPoint.F2m) {
            ECPoint.F2m f2m = (ECPoint.F2m) eCPoint;
            ECCurve.F2m f2m2 = (ECCurve.F2m) f2m.getCurve();
            int m = f2m2.getM();
            byte byteValue = f2m2.getA().toBigInteger().byteValue();
            byte mu = f2m2.getMu();
            return multiplyWTnaf(f2m, Tnaf.partModReduction(bigInteger, m, byteValue, f2m2.getSi(), mu, (byte) 10), preCompInfo, byteValue, mu);
        }
        throw new IllegalArgumentException("Only ECPoint.F2m can be used in WTauNafMultiplier");
    }
}
