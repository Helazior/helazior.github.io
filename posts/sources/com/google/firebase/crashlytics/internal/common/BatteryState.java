package com.google.firebase.crashlytics.internal.common;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import com.google.firebase.crashlytics.internal.Logger;
import com.google.firebase.crashlytics.internal.settings.SettingsJsonConstants;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class BatteryState {
    public static final int VELOCITY_CHARGING = 2;
    public static final int VELOCITY_FULL = 3;
    public static final int VELOCITY_UNPLUGGED = 1;
    private final Float level;
    private final boolean powerConnected;

    private BatteryState(Float f, boolean z) {
        this.powerConnected = z;
        this.level = f;
    }

    public static BatteryState get(Context context) {
        Float f = null;
        boolean z = false;
        try {
            Intent registerReceiver = context.registerReceiver(null, new IntentFilter("android.intent.action.BATTERY_CHANGED"));
            if (registerReceiver != null) {
                z = isPowerConnected(registerReceiver);
                f = getLevel(registerReceiver);
            }
        } catch (IllegalStateException e) {
            Logger.getLogger().m1081e("An error occurred getting battery state.", e);
        }
        return new BatteryState(f, z);
    }

    private static Float getLevel(Intent intent) {
        int intExtra = intent.getIntExtra("level", -1);
        int intExtra2 = intent.getIntExtra("scale", -1);
        if (intExtra == -1 || intExtra2 == -1) {
            return null;
        }
        return Float.valueOf(intExtra / intExtra2);
    }

    public Float getBatteryLevel() {
        return this.level;
    }

    public int getBatteryVelocity() {
        Float f;
        if (!this.powerConnected || (f = this.level) == null) {
            return 1;
        }
        return ((double) f.floatValue()) < 0.99d ? 2 : 3;
    }

    public boolean isPowerConnected() {
        return this.powerConnected;
    }

    private static boolean isPowerConnected(Intent intent) {
        int intExtra = intent.getIntExtra(SettingsJsonConstants.APP_STATUS_KEY, -1);
        if (intExtra == -1) {
            return false;
        }
        return intExtra == 2 || intExtra == 5;
    }
}
