package com.google.android.datatransport.cct.internal;

import com.google.firebase.encoders.FieldDescriptor;
import com.google.firebase.encoders.ObjectEncoder;
import com.google.firebase.encoders.ObjectEncoderContext;
import com.google.firebase.encoders.config.Configurator;
import com.google.firebase.encoders.config.EncoderConfig;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class AutoBatchedLogRequestEncoder implements Configurator {
    public static final int CODEGEN_VERSION = 2;
    public static final Configurator CONFIG = new AutoBatchedLogRequestEncoder();

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class AndroidClientInfoEncoder implements ObjectEncoder<AndroidClientInfo> {
        public static final AndroidClientInfoEncoder INSTANCE = new AndroidClientInfoEncoder();
        private static final FieldDescriptor SDKVERSION_DESCRIPTOR = FieldDescriptor.m1074of("sdkVersion");
        private static final FieldDescriptor MODEL_DESCRIPTOR = FieldDescriptor.m1074of("model");
        private static final FieldDescriptor HARDWARE_DESCRIPTOR = FieldDescriptor.m1074of("hardware");
        private static final FieldDescriptor DEVICE_DESCRIPTOR = FieldDescriptor.m1074of("device");
        private static final FieldDescriptor PRODUCT_DESCRIPTOR = FieldDescriptor.m1074of("product");
        private static final FieldDescriptor OSBUILD_DESCRIPTOR = FieldDescriptor.m1074of("osBuild");
        private static final FieldDescriptor MANUFACTURER_DESCRIPTOR = FieldDescriptor.m1074of("manufacturer");
        private static final FieldDescriptor FINGERPRINT_DESCRIPTOR = FieldDescriptor.m1074of("fingerprint");
        private static final FieldDescriptor LOCALE_DESCRIPTOR = FieldDescriptor.m1074of("locale");
        private static final FieldDescriptor COUNTRY_DESCRIPTOR = FieldDescriptor.m1074of("country");
        private static final FieldDescriptor MCCMNC_DESCRIPTOR = FieldDescriptor.m1074of("mccMnc");
        private static final FieldDescriptor APPLICATIONBUILD_DESCRIPTOR = FieldDescriptor.m1074of("applicationBuild");

        private AndroidClientInfoEncoder() {
        }

        @Override // com.google.firebase.encoders.Encoder
        public void encode(AndroidClientInfo androidClientInfo, ObjectEncoderContext objectEncoderContext) {
            objectEncoderContext.add(SDKVERSION_DESCRIPTOR, androidClientInfo.getSdkVersion());
            objectEncoderContext.add(MODEL_DESCRIPTOR, androidClientInfo.getModel());
            objectEncoderContext.add(HARDWARE_DESCRIPTOR, androidClientInfo.getHardware());
            objectEncoderContext.add(DEVICE_DESCRIPTOR, androidClientInfo.getDevice());
            objectEncoderContext.add(PRODUCT_DESCRIPTOR, androidClientInfo.getProduct());
            objectEncoderContext.add(OSBUILD_DESCRIPTOR, androidClientInfo.getOsBuild());
            objectEncoderContext.add(MANUFACTURER_DESCRIPTOR, androidClientInfo.getManufacturer());
            objectEncoderContext.add(FINGERPRINT_DESCRIPTOR, androidClientInfo.getFingerprint());
            objectEncoderContext.add(LOCALE_DESCRIPTOR, androidClientInfo.getLocale());
            objectEncoderContext.add(COUNTRY_DESCRIPTOR, androidClientInfo.getCountry());
            objectEncoderContext.add(MCCMNC_DESCRIPTOR, androidClientInfo.getMccMnc());
            objectEncoderContext.add(APPLICATIONBUILD_DESCRIPTOR, androidClientInfo.getApplicationBuild());
        }
    }

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class BatchedLogRequestEncoder implements ObjectEncoder<BatchedLogRequest> {
        public static final BatchedLogRequestEncoder INSTANCE = new BatchedLogRequestEncoder();
        private static final FieldDescriptor LOGREQUEST_DESCRIPTOR = FieldDescriptor.m1074of("logRequest");

        private BatchedLogRequestEncoder() {
        }

        @Override // com.google.firebase.encoders.Encoder
        public void encode(BatchedLogRequest batchedLogRequest, ObjectEncoderContext objectEncoderContext) {
            objectEncoderContext.add(LOGREQUEST_DESCRIPTOR, batchedLogRequest.getLogRequests());
        }
    }

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class ClientInfoEncoder implements ObjectEncoder<ClientInfo> {
        public static final ClientInfoEncoder INSTANCE = new ClientInfoEncoder();
        private static final FieldDescriptor CLIENTTYPE_DESCRIPTOR = FieldDescriptor.m1074of("clientType");
        private static final FieldDescriptor ANDROIDCLIENTINFO_DESCRIPTOR = FieldDescriptor.m1074of("androidClientInfo");

        private ClientInfoEncoder() {
        }

        @Override // com.google.firebase.encoders.Encoder
        public void encode(ClientInfo clientInfo, ObjectEncoderContext objectEncoderContext) {
            objectEncoderContext.add(CLIENTTYPE_DESCRIPTOR, clientInfo.getClientType());
            objectEncoderContext.add(ANDROIDCLIENTINFO_DESCRIPTOR, clientInfo.getAndroidClientInfo());
        }
    }

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class LogEventEncoder implements ObjectEncoder<LogEvent> {
        public static final LogEventEncoder INSTANCE = new LogEventEncoder();
        private static final FieldDescriptor EVENTTIMEMS_DESCRIPTOR = FieldDescriptor.m1074of("eventTimeMs");
        private static final FieldDescriptor EVENTCODE_DESCRIPTOR = FieldDescriptor.m1074of("eventCode");
        private static final FieldDescriptor EVENTUPTIMEMS_DESCRIPTOR = FieldDescriptor.m1074of("eventUptimeMs");
        private static final FieldDescriptor SOURCEEXTENSION_DESCRIPTOR = FieldDescriptor.m1074of("sourceExtension");
        private static final FieldDescriptor SOURCEEXTENSIONJSONPROTO3_DESCRIPTOR = FieldDescriptor.m1074of("sourceExtensionJsonProto3");
        private static final FieldDescriptor TIMEZONEOFFSETSECONDS_DESCRIPTOR = FieldDescriptor.m1074of("timezoneOffsetSeconds");
        private static final FieldDescriptor NETWORKCONNECTIONINFO_DESCRIPTOR = FieldDescriptor.m1074of("networkConnectionInfo");

        private LogEventEncoder() {
        }

        @Override // com.google.firebase.encoders.Encoder
        public void encode(LogEvent logEvent, ObjectEncoderContext objectEncoderContext) {
            objectEncoderContext.add(EVENTTIMEMS_DESCRIPTOR, logEvent.getEventTimeMs());
            objectEncoderContext.add(EVENTCODE_DESCRIPTOR, logEvent.getEventCode());
            objectEncoderContext.add(EVENTUPTIMEMS_DESCRIPTOR, logEvent.getEventUptimeMs());
            objectEncoderContext.add(SOURCEEXTENSION_DESCRIPTOR, logEvent.getSourceExtension());
            objectEncoderContext.add(SOURCEEXTENSIONJSONPROTO3_DESCRIPTOR, logEvent.getSourceExtensionJsonProto3());
            objectEncoderContext.add(TIMEZONEOFFSETSECONDS_DESCRIPTOR, logEvent.getTimezoneOffsetSeconds());
            objectEncoderContext.add(NETWORKCONNECTIONINFO_DESCRIPTOR, logEvent.getNetworkConnectionInfo());
        }
    }

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class LogRequestEncoder implements ObjectEncoder<LogRequest> {
        public static final LogRequestEncoder INSTANCE = new LogRequestEncoder();
        private static final FieldDescriptor REQUESTTIMEMS_DESCRIPTOR = FieldDescriptor.m1074of("requestTimeMs");
        private static final FieldDescriptor REQUESTUPTIMEMS_DESCRIPTOR = FieldDescriptor.m1074of("requestUptimeMs");
        private static final FieldDescriptor CLIENTINFO_DESCRIPTOR = FieldDescriptor.m1074of("clientInfo");
        private static final FieldDescriptor LOGSOURCE_DESCRIPTOR = FieldDescriptor.m1074of("logSource");
        private static final FieldDescriptor LOGSOURCENAME_DESCRIPTOR = FieldDescriptor.m1074of("logSourceName");
        private static final FieldDescriptor LOGEVENT_DESCRIPTOR = FieldDescriptor.m1074of("logEvent");
        private static final FieldDescriptor QOSTIER_DESCRIPTOR = FieldDescriptor.m1074of("qosTier");

        private LogRequestEncoder() {
        }

        @Override // com.google.firebase.encoders.Encoder
        public void encode(LogRequest logRequest, ObjectEncoderContext objectEncoderContext) {
            objectEncoderContext.add(REQUESTTIMEMS_DESCRIPTOR, logRequest.getRequestTimeMs());
            objectEncoderContext.add(REQUESTUPTIMEMS_DESCRIPTOR, logRequest.getRequestUptimeMs());
            objectEncoderContext.add(CLIENTINFO_DESCRIPTOR, logRequest.getClientInfo());
            objectEncoderContext.add(LOGSOURCE_DESCRIPTOR, logRequest.getLogSource());
            objectEncoderContext.add(LOGSOURCENAME_DESCRIPTOR, logRequest.getLogSourceName());
            objectEncoderContext.add(LOGEVENT_DESCRIPTOR, logRequest.getLogEvents());
            objectEncoderContext.add(QOSTIER_DESCRIPTOR, logRequest.getQosTier());
        }
    }

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class NetworkConnectionInfoEncoder implements ObjectEncoder<NetworkConnectionInfo> {
        public static final NetworkConnectionInfoEncoder INSTANCE = new NetworkConnectionInfoEncoder();
        private static final FieldDescriptor NETWORKTYPE_DESCRIPTOR = FieldDescriptor.m1074of("networkType");
        private static final FieldDescriptor MOBILESUBTYPE_DESCRIPTOR = FieldDescriptor.m1074of("mobileSubtype");

        private NetworkConnectionInfoEncoder() {
        }

        @Override // com.google.firebase.encoders.Encoder
        public void encode(NetworkConnectionInfo networkConnectionInfo, ObjectEncoderContext objectEncoderContext) {
            objectEncoderContext.add(NETWORKTYPE_DESCRIPTOR, networkConnectionInfo.getNetworkType());
            objectEncoderContext.add(MOBILESUBTYPE_DESCRIPTOR, networkConnectionInfo.getMobileSubtype());
        }
    }

    private AutoBatchedLogRequestEncoder() {
    }

    @Override // com.google.firebase.encoders.config.Configurator
    public void configure(EncoderConfig<?> encoderConfig) {
        BatchedLogRequestEncoder batchedLogRequestEncoder = BatchedLogRequestEncoder.INSTANCE;
        encoderConfig.registerEncoder(BatchedLogRequest.class, batchedLogRequestEncoder);
        encoderConfig.registerEncoder(AutoValue_BatchedLogRequest.class, batchedLogRequestEncoder);
        LogRequestEncoder logRequestEncoder = LogRequestEncoder.INSTANCE;
        encoderConfig.registerEncoder(LogRequest.class, logRequestEncoder);
        encoderConfig.registerEncoder(AutoValue_LogRequest.class, logRequestEncoder);
        ClientInfoEncoder clientInfoEncoder = ClientInfoEncoder.INSTANCE;
        encoderConfig.registerEncoder(ClientInfo.class, clientInfoEncoder);
        encoderConfig.registerEncoder(AutoValue_ClientInfo.class, clientInfoEncoder);
        AndroidClientInfoEncoder androidClientInfoEncoder = AndroidClientInfoEncoder.INSTANCE;
        encoderConfig.registerEncoder(AndroidClientInfo.class, androidClientInfoEncoder);
        encoderConfig.registerEncoder(AutoValue_AndroidClientInfo.class, androidClientInfoEncoder);
        LogEventEncoder logEventEncoder = LogEventEncoder.INSTANCE;
        encoderConfig.registerEncoder(LogEvent.class, logEventEncoder);
        encoderConfig.registerEncoder(AutoValue_LogEvent.class, logEventEncoder);
        NetworkConnectionInfoEncoder networkConnectionInfoEncoder = NetworkConnectionInfoEncoder.INSTANCE;
        encoderConfig.registerEncoder(NetworkConnectionInfo.class, networkConnectionInfoEncoder);
        encoderConfig.registerEncoder(AutoValue_NetworkConnectionInfo.class, networkConnectionInfoEncoder);
    }
}
