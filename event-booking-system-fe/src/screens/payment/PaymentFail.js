import { Link, useSearchParams } from "react-router-dom";

const PaymentFail = () => {
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
                                    className="bi bi-x-circle-fill text-danger"
                                    style={{ fontSize: "5rem" }}
                                ></i>
                            </div>

                            <h2 className="text-danger fw-bold mb-3">
                                Thanh toán thất bại!
                            </h2>

                            <p className="text-muted">
                                Giao dịch không được hoàn tất hoặc đã bị hủy.
                            </p>

                            <div className="alert alert-danger mt-4">
                                <strong>Mã đơn hàng:</strong> #{orderId}
                            </div>

                            <div className="mt-4">
                                <Link
                                    to={`/event/${eventId}`}
                                    className="btn btn-outline-primary"
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