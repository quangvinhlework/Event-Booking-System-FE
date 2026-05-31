import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");
    const eventId = searchParams.get("eventId");

    return (
        <div className="page-shell d-flex align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="surface-panel p-5 text-center" style={{ borderRadius: '16px' }}>
                            <div className="mb-4">
                                <i
                                    className="bi bi-check-circle-fill"
                                    style={{ fontSize: "5rem", color: "#6ee7b7" }}
                                ></i>
                            </div>

                            <h2 className="page-title-lg mb-3" style={{ color: "#6ee7b7" }}>
                                Thanh toán thành công!
                            </h2>

                            <p className="text-muted mb-4">
                                Cảm ơn bạn đã đặt vé. Đơn hàng của bạn đã được thanh toán thành
                                công.
                            </p>

                            <div
                                className="mb-4 p-3 rounded"
                                style={{
                                    backgroundColor: "rgba(110, 231, 183, 0.1)",
                                    border: "1px solid rgba(110, 231, 183, 0.2)",
                                    color: "#6ee7b7"
                                }}
                            >
                                <strong className="me-2">Mã đơn hàng:</strong> #{orderId}
                            </div>

                            <div className="mt-4">
                                <Link
                                    to={`/event/${eventId}`}
                                    className="btn-primary-accent w-100 text-decoration-none"
                                    style={{ borderRadius: '8px' }}
                                >
                                    ← Quay lại sự kiện
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;