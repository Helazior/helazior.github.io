package com.google.firebase.crashlytics.internal.stacktrace;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class TrimmedThrowableData {
    public final TrimmedThrowableData cause;
    public final String className;
    public final String localizedMessage;
    public final StackTraceElement[] stacktrace;

    public TrimmedThrowableData(Throwable th, StackTraceTrimmingStrategy stackTraceTrimmingStrategy) {
        this.localizedMessage = th.getLocalizedMessage();
        this.className = th.getClass().getName();
        this.stacktrace = stackTraceTrimmingStrategy.getTrimmedStackTrace(th.getStackTrace());
        Throwable cause = th.getCause();
        this.cause = cause != null ? new TrimmedThrowableData(cause, stackTraceTrimmingStrategy) : null;
    }
}
