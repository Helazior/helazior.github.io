package com.google.firebase.messaging;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;
import android.util.Log;
import com.google.firebase.crashlytics.internal.common.CrashlyticsController;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import org.json.JSONException;
import org.json.JSONObject;
import p000.C2307w3;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class Store {
    public final Context context;
    public final SharedPreferences store;

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class Token {
        private static final long REFRESH_PERIOD_MILLIS = TimeUnit.DAYS.toMillis(7);
        public final String appVersion;
        public final long timestamp;
        public final String token;

        private Token(String str, String str2, long j) {
            this.token = str;
            this.appVersion = str2;
            this.timestamp = j;
        }

        public static String encode(String str, String str2, long j) {
            try {
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("token", str);
                jSONObject.put("appVersion", str2);
                jSONObject.put(CrashlyticsController.FIREBASE_TIMESTAMP, j);
                return jSONObject.toString();
            } catch (JSONException e) {
                String valueOf = String.valueOf(e);
                StringBuilder sb = new StringBuilder(valueOf.length() + 24);
                sb.append("Failed to encode token: ");
                sb.append(valueOf);
                Log.w(Constants.TAG, sb.toString());
                return null;
            }
        }

        public static Token parse(String str) {
            if (TextUtils.isEmpty(str)) {
                return null;
            }
            if (str.startsWith("{")) {
                try {
                    JSONObject jSONObject = new JSONObject(str);
                    return new Token(jSONObject.getString("token"), jSONObject.getString("appVersion"), jSONObject.getLong(CrashlyticsController.FIREBASE_TIMESTAMP));
                } catch (JSONException e) {
                    String valueOf = String.valueOf(e);
                    StringBuilder sb = new StringBuilder(valueOf.length() + 23);
                    sb.append("Failed to parse token: ");
                    sb.append(valueOf);
                    Log.w(Constants.TAG, sb.toString());
                    return null;
                }
            }
            return new Token(str, null, 0L);
        }

        public boolean needsRefresh(String str) {
            return System.currentTimeMillis() > this.timestamp + REFRESH_PERIOD_MILLIS || !str.equals(this.appVersion);
        }
    }

    public Store(Context context) {
        this.context = context;
        this.store = context.getSharedPreferences("com.google.android.gms.appid", 0);
        checkForRestore("com.google.android.gms.appid-no-backup");
    }

    private void checkForRestore(String str) {
        Context context = this.context;
        Object obj = C2307w3.f6741a;
        File file = new File(C2307w3.C2310c.m201c(context), "com.google.android.gms.appid-no-backup");
        if (file.exists()) {
            return;
        }
        try {
            if (!file.createNewFile() || isEmpty()) {
                return;
            }
            Log.i(Constants.TAG, "App restored, clearing state");
            deleteAll();
        } catch (IOException e) {
            if (Log.isLoggable(Constants.TAG, 3)) {
                String valueOf = String.valueOf(e.getMessage());
                Log.d(Constants.TAG, valueOf.length() != 0 ? "Error creating file in no backup dir: ".concat(valueOf) : new String("Error creating file in no backup dir: "));
            }
        }
    }

    private String createTokenKey(String str, String str2) {
        StringBuilder sb = new StringBuilder(String.valueOf(str).length() + 5 + String.valueOf(str2).length());
        sb.append(str);
        sb.append("|T|");
        sb.append(str2);
        sb.append("|*");
        return sb.toString();
    }

    public synchronized void deleteAll() {
        this.store.edit().clear().commit();
    }

    public synchronized void deleteToken(String str, String str2) {
        String createTokenKey = createTokenKey(str, str2);
        SharedPreferences.Editor edit = this.store.edit();
        edit.remove(createTokenKey);
        edit.commit();
    }

    public synchronized Token getToken(String str, String str2) {
        return Token.parse(this.store.getString(createTokenKey(str, str2), null));
    }

    public synchronized boolean isEmpty() {
        return this.store.getAll().isEmpty();
    }

    public synchronized void saveToken(String str, String str2, String str3, String str4) {
        String encode = Token.encode(str3, str4, System.currentTimeMillis());
        if (encode == null) {
            return;
        }
        SharedPreferences.Editor edit = this.store.edit();
        edit.putString(createTokenKey(str, str2), encode);
        edit.commit();
    }
}
