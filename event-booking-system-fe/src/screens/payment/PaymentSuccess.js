import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");
    const eventId = searchParams.get("eventId");

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0">
                        <div className="card-body text-center p-5">
                            <div className="mb-4">
                                <i
                                    className="bi bi-check-circle-fill text-success"
                                    style={{ fontSize: "5rem" }}
                                ></i>
                            </div>

                            <h2 className="text-success fw-bold mb-3">
                                Thanh toán thành công!
                            </h2>

                            <p className="text-muted">
                                Cảm ơn bạn đã đặt vé. Đơn hàng của bạn đã được thanh toán thành
                                công.
                            </p>

                            <div className="alert alert-success mt-4">
                                <strong>Mã đơn hàng:</strong> #{orderId}
                            </div>

                            <div className="mt-4">
                                <Link
                                    to={`/event/${eventId}`}
                                    className="btn btn-primary"
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