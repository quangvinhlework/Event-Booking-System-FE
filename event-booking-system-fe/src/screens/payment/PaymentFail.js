import { Link, useSearchParams } from "react-router-dom";

const PaymentFail = () => {
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
                                    className="bi bi-x-circle-fill"
                                    style={{ fontSize: "5rem", color: "#f87171" }}
                                ></i>
                            </div>

                            <h2 className="page-title-lg mb-3" style={{ color: "#f87171" }}>
                                Thanh toán thất bại!
                            </h2>

                            <p className="text-muted mb-4">
                                Giao dịch không được hoàn tất hoặc đã bị hủy.
                            </p>

                            <div
                                className="mb-4 p-3 rounded"
                                style={{
                                    backgroundColor: "rgba(248, 113, 113, 0.1)",
                                    border: "1px solid rgba(248, 113, 113, 0.2)",
                                    color: "#f87171"
                                }}
                            >
                                <strong className="me-2">Mã đơn hàng:</strong> #{orderId}
                            </div>

                            <div className="mt-4">
                                <Link
                                    to={`/event/${eventId}`}
                                    className="btn-ghost w-100 text-decoration-none"
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

export default PaymentFail;