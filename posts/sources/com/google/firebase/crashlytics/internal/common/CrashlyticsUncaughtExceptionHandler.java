package com.google.firebase.crashlytics.internal.common;

import com.google.firebase.crashlytics.internal.Logger;
import com.google.firebase.crashlytics.internal.settings.SettingsDataProvider;
import java.lang.Thread;
import java.util.concurrent.atomic.AtomicBoolean;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CrashlyticsUncaughtExceptionHandler implements Thread.UncaughtExceptionHandler {
    private final CrashListener crashListener;
    private final Thread.UncaughtExceptionHandler defaultHandler;
    private final AtomicBoolean isHandlingException = new AtomicBoolean(false);
    private final SettingsDataProvider settingsDataProvider;

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public interface CrashListener {
        void onUncaughtException(SettingsDataProvider settingsDataProvider, Thread thread, Throwable th);
    }

    public CrashlyticsUncaughtExceptionHandler(CrashListener crashListener, SettingsDataProvider settingsDataProvider, Thread.UncaughtExceptionHandler uncaughtExceptionHandler) {
        this.crashListener = crashListener;
        this.settingsDataProvider = settingsDataProvider;
        this.defaultHandler = uncaughtExceptionHandler;
    }

    public boolean isHandlingException() {
        return this.isHandlingException.get();
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r1v1, types: [java.lang.String] */
    /* JADX WARN: Type inference failed for: r1v2, types: [java.lang.String] */
    /* JADX WARN: Type inference failed for: r1v3, types: [java.lang.Thread$UncaughtExceptionHandler] */
    /* JADX WARN: Type inference failed for: r1v4, types: [java.lang.Thread$UncaughtExceptionHandler] */
    /* JADX WARN: Type inference failed for: r3v1, types: [com.google.firebase.crashlytics.internal.Logger] */
    /* JADX WARN: Type inference failed for: r6v0, types: [java.lang.Thread] */
    /* JADX WARN: Type inference failed for: r6v1, types: [java.lang.Thread] */
    /* JADX WARN: Type inference failed for: r6v3, types: [java.util.concurrent.atomic.AtomicBoolean] */
    @Override // java.lang.Thread.UncaughtExceptionHandler
    public void uncaughtException(Thread thread, Throwable th) {
        this.isHandlingException.set(true);
        ?? r1 = "Completed exception processing. Invoking default exception handler.";
        try {
            try {
                if (thread == 0) {
                    Logger.getLogger().m1082e("Could not handle uncaught exception; null thread");
                } else if (th == null) {
                    Logger.getLogger().m1082e("Could not handle uncaught exception; null throwable");
                } else {
                    this.crashListener.onUncaughtException(this.settingsDataProvider, thread, th);
                }
            } catch (Exception e) {
                Logger.getLogger().m1081e("An error occurred in the uncaught exception handler", e);
            }
            Logger.getLogger().m1084d("Completed exception processing. Invoking default exception handler.");
            r1 = this.defaultHandler;
            r1.uncaughtException(thread, th);
            thread = this.isHandlingException;
            thread.set(false);
        } catch (Throwable th2) {
            Logger.getLogger().m1084d(r1);
            this.defaultHandler.uncaughtException(thread, th);
            this.isHandlingException.set(false);
            throw th2;
        }
    }
}
