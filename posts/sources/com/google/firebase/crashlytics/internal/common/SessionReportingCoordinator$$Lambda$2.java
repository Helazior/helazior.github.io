package com.google.firebase.crashlytics.internal.common;

import com.google.firebase.crashlytics.internal.model.CrashlyticsReport;
import java.util.Comparator;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final /* synthetic */ class SessionReportingCoordinator$$Lambda$2 implements Comparator {
    private static final SessionReportingCoordinator$$Lambda$2 instance = new SessionReportingCoordinator$$Lambda$2();

    private SessionReportingCoordinator$$Lambda$2() {
    }

    public static Comparator lambdaFactory$() {
        return instance;
    }

    @Override // java.util.Comparator
    public int compare(Object obj, Object obj2) {
        int compareTo;
        compareTo = ((CrashlyticsReport.CustomAttribute) obj).getKey().compareTo(((CrashlyticsReport.CustomAttribute) obj2).getKey());
        return compareTo;
    }
}
