import { useState } from "react";
import { CommonButton } from "../../Attribute";
import { Typography } from "antd";
import { WALLETFILTERS } from "../../Types";

const { Text } = Typography;

export const Wallet = ({ balance, stats, grouped, filter, setFilter, copy }: any) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));
  return (
    <>
      <div className="wallet">
        <div className="walletCards">
          <div className="card">
            <p className="cardMuted">Wallet Balance</p>
            <h1 className="cardBalance">₹ {balance}</h1>
          </div>
          <div className="card cardCredit">
            <p className="cardMuted">Total Credit</p>
            <h1 className="text-2xl font-semibold text-success">
              ₹ {stats.totalCredits}
            </h1>
          </div>
          <div className="card cardDebit">
            <p className="cardMuted">Total Debit</p>
            <h1 className="text-2xl font-semibold text-warning">
              ₹ {stats.totalDebits}
            </h1>
          </div>
        </div>
        <div className="filterWrap">
          {WALLETFILTERS.map((t) => (
            <CommonButton key={t} onClick={() => setFilter(t)} className={`filterBtn ${ filter === t ? "filterActive" : "filterInactive" }`} > {t.toUpperCase()} </CommonButton>
          ))}
        </div>
        <div className="groupWrap">
          {Object.entries(grouped).map(([date, items]: any) => (
            <div key={date}>
              <p className="groupDate">{date}</p>
              <div className="listBox">
                {items.map((i: any) => {
                  const isOpen = openId === i._id;
                  const isCredit = i.type === "credit";
                  return (
                    <div key={i._id}>
                      <div onClick={() => toggle(i._id)} className={`row ${isOpen ? "rowOpen" : ""}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`badge ${ isCredit ? "badgeCredit" : "badgeDebit" }`} >
                              {i.type.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-muted"> {new Date(i.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-foreground/80"> {i.description} </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${ isCredit ? "text-success" : "text-warning" }`} > {isCredit ? "+" : "-"} ₹{i.amount} </p>
                          <p className="text-[11px] text-muted"> ₹{i.newBalance} </p>
                        </div>
                      </div>
                      <div className={`detailsWrap ${ isOpen ? "detailsOpen" : "detailsClosed" }`} >
                        <div className="detailsBox">
                          <div>
                            <p className="text-xs text-muted">ID Payment</p>
                            <p>#{i._id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted">Transaction ID</p>
                            <p className="flex items-center gap-1">
                              {i._id.slice(-10)}
                              <Text copyable={{ text: i._id, onCopy: () => copy(i._id) }} > {i._id.slice(-10)} </Text>
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted">Balance After</p>
                            <p>₹{i.newBalance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
