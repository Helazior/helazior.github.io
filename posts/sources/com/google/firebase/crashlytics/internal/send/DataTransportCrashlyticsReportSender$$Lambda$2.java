package com.google.firebase.crashlytics.internal.send;

import com.bumptech.glide.load.Key;
import com.google.android.datatransport.Transformer;
import com.google.firebase.crashlytics.internal.model.CrashlyticsReport;
import java.nio.charset.Charset;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final /* synthetic */ class DataTransportCrashlyticsReportSender$$Lambda$2 implements Transformer {
    private static final DataTransportCrashlyticsReportSender$$Lambda$2 instance = new DataTransportCrashlyticsReportSender$$Lambda$2();

    private DataTransportCrashlyticsReportSender$$Lambda$2() {
    }

    public static Transformer lambdaFactory$() {
        return instance;
    }

    @Override // com.google.android.datatransport.Transformer
    public Object apply(Object obj) {
        byte[] bytes;
        bytes = DataTransportCrashlyticsReportSender.TRANSFORM.reportToJson((CrashlyticsReport) obj).getBytes(Charset.forName(Key.STRING_CHARSET_NAME));
        return bytes;
    }
}
